import { PRIVATE_SUPABASE_KEY, LEMONSQUEEZY_WEBHOOK_SECRET } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '@/lib/database.types';
import { createClient } from '@supabase/supabase-js';
import { json, type RequestHandler } from '@sveltejs/kit';
import crypto from 'crypto';

const supabaseClient = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});

const jsonError = (message: string, status: number) =>
	json({ error: message }, { status, headers: { 'content-type': 'application/json' } });

// Helper function to verify LemonSqueezy webhook signature
const verifyWebhookSignature = (payload: string, signature: string): boolean => {
	const hmac = crypto.createHmac('sha256', LEMONSQUEEZY_WEBHOOK_SECRET);
	const digest = hmac.update(payload).digest('hex');
	return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

// Define types for LemonSqueezy webhook data
type LemonSqueezyEventAttributes = {
	user_email: string;
	subscription_id?: string;
	order_id?: number;
	customer_id: string;
	status: string;
	renews_at?: string;
	ends_at?: string;
	created_at: string;
};

type LemonSqueezyEventData = {
	attributes: LemonSqueezyEventAttributes;
};

type LemonSqueezyEvent = {
	meta: {
		event_name: string;
	};
	data: LemonSqueezyEventData;
};

// Helper function to get or create a user
const getOrCreateUser = async (userEmail: string) => {
	// Check if user exists in profiles
	const { data: userData, error: userError } = await supabaseClient
		.from('profiles')
		.select()
		.eq('email', userEmail)
		.single();

	if (userError || !userData?.email) {
		// Create new user if doesn't exist
		const { data: newUserData, error: newUserError } = await supabaseClient.auth.admin.createUser({
			email: userEmail
		});

		if (newUserError || !newUserData.user) {
			throw new Error(`Failed to create user: ${newUserError?.message || 'Unknown error'}`);
		}

		// Create profile entry for new user
		const { data: profileData, error: profileError } = await supabaseClient
			.from('profiles')
			.insert({
				id: newUserData.user.id,
				email: userEmail,
				user_id: newUserData.user.id
			})
			.select()
			.single();

		if (profileError || !profileData) {
			throw new Error(`Failed to create profile: ${profileError?.message || 'Unknown error'}`);
		}

		return profileData;
	}

	return userData;
};

// Function to handle subscription creation
const subscriptionCreated = async (data: LemonSqueezyEventData) => {
	const { attributes } = data;

	try {
		const userData = await getOrCreateUser(attributes.user_email);

		// Check if it's a one-time payment (no renewal date)
		const isOneTime = !attributes.renews_at;
		const subscriptionId = attributes.subscription_id?.toString() || '';

		if (!subscriptionId) {
			return jsonError('Missing subscription ID', 400);
		}

		const { error } = await supabaseClient.from('subscriptions').insert({
			user_email: attributes.user_email,
			user_id: userData.id,
			stripe_subscription_id: subscriptionId,
			status: attributes.status,
			customer_id: attributes.customer_id,
			// For one-time payments, use a far future date
			current_period_end: isOneTime ? '2099-12-31T23:59:59Z' : attributes.ends_at,
			current_period_start: attributes.created_at,
			metadata: { is_lifetime: isOneTime, source: 'lemonsqueezy' }
		});

		if (error) {
			return jsonError(`Failed to create subscription: ${error.message}`, 400);
		}

		console.log('New subscription created for:', userData.email);
		return json({ status: 'success' });
	} catch (err) {
		return jsonError(`Subscription creation failed: ${(err as Error).message}`, 400);
	}
};

// Function to handle subscription deletion
const subscriptionDeleted = async (data: LemonSqueezyEventData) => {
	try {
		const subscriptionId = data.attributes.subscription_id?.toString();

		if (!subscriptionId) {
			return jsonError('Missing subscription ID', 400);
		}

		const { error } = await supabaseClient
			.from('subscriptions')
			.delete()
			.eq('stripe_subscription_id', subscriptionId);

		if (error) {
			return jsonError(`Failed to delete subscription: ${error.message}`, 400);
		}

		return json({ status: 'success' });
	} catch (err) {
		return jsonError(`Subscription deletion failed: ${(err as Error).message}`, 400);
	}
};

// Function to handle subscription updates
const subscriptionUpdated = async (data: LemonSqueezyEventData) => {
	const { attributes } = data;
	const subscriptionId = attributes.subscription_id?.toString();

	if (!subscriptionId) {
		return jsonError('Missing subscription ID', 400);
	}

	try {
		const { data: existingSub } = await supabaseClient
			.from('subscriptions')
			.select()
			.eq('stripe_subscription_id', subscriptionId)
			.single();

		if (!existingSub) {
			// If subscription doesn't exist, create it
			return subscriptionCreated(data);
		}

		const { error } = await supabaseClient
			.from('subscriptions')
			.update({
				current_period_end: attributes.ends_at,
				status: attributes.status
			})
			.eq('stripe_subscription_id', subscriptionId);

		if (error) {
			return jsonError(`Failed to update subscription: ${error.message}`, 400);
		}

		return json({ status: 'success' });
	} catch (err) {
		return jsonError(`Subscription update failed: ${(err as Error).message}`, 400);
	}
};

// Function to handle one-time purchase
const orderCreated = async (data: LemonSqueezyEventData) => {
	const { attributes } = data;

	try {
		const userData = await getOrCreateUser(attributes.user_email);
		const orderId = attributes.order_id?.toString();

		if (!orderId) {
			return jsonError('Missing order ID', 400);
		}

		const { error } = await supabaseClient.from('subscriptions').insert({
			user_email: attributes.user_email,
			user_id: userData.id,
			stripe_subscription_id: orderId,
			status: 'active',
			customer_id: attributes.customer_id,
			current_period_end: '2099-12-31T23:59:59Z',
			current_period_start: attributes.created_at,
			metadata: { is_lifetime: true, source: 'lemonsqueezy' }
		});

		if (error) {
			return jsonError(`Failed to create lifetime subscription: ${error.message}`, 400);
		}

		console.log('New lifetime subscription created for:', userData.email);
		return json({ status: 'success' });
	} catch (err) {
		return jsonError(`Order processing failed: ${(err as Error).message}`, 400);
	}
};

export const POST = (async ({ request }) => {
	const signature = request.headers.get('x-signature');
	if (!signature) {
		return jsonError('No signature', 400);
	}

	const rawBody = await request.text();

	if (!verifyWebhookSignature(rawBody, signature)) {
		return jsonError('Invalid signature', 401);
	}

	try {
		const event = JSON.parse(rawBody) as LemonSqueezyEvent;

		switch (event.meta.event_name) {
			case 'order_created':
				return orderCreated(event.data);
			case 'subscription_created':
				return subscriptionCreated(event.data);
			case 'subscription_updated':
				return subscriptionUpdated(event.data);
			case 'subscription_cancelled':
				return subscriptionDeleted(event.data);
			default:
				console.log(`Ignored webhook event: ${event.meta.event_name}`);
				return json({ status: 'ok' });
		}
	} catch (err) {
		console.error('Webhook Error:', err);
		return jsonError(`Webhook Error: ${(err as Error).message}`, 400);
	}
}) satisfies RequestHandler;
