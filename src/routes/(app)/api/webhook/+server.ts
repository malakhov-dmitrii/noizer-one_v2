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

// Function to handle subscription creation
const subscriptionCreated = async (data: any) => {
	const { attributes } = data;
	const userEmail = attributes.user_email;

	// First check if user exists in profiles
	const user = await supabaseClient.from('profiles').select().eq('email', userEmail).single();

	let userData = user.data;
	if (!userData?.email) {
		// Create new user if doesn't exist
		const newUser = await supabaseClient.auth.admin.createUser({
			email: userEmail
		});
		if (!newUser.data.user) return jsonError('User not found', 400);

		// Create profile entry for new user
		const { data: profileData, error: profileError } = await supabaseClient
			.from('profiles')
			.insert({
				id: newUser.data.user.id,
				email: userEmail,
				user_id: newUser.data.user.id
			})
			.select()
			.single();

		if (profileError) return jsonError('Failed to create profile', 400);
		userData = profileData;
	}

	if (!userData?.email) return jsonError('User not found', 400);

	// Check if it's a one-time payment (no renewal date)
	const isOneTime = !attributes.renews_at;

	const newSub = await supabaseClient
		.from('subscriptions')
		.insert({
			user_email: userData.email,
			user_id: userData.id,
			lemonsqueezy_subscription_id: attributes.subscription_id,
			status: attributes.status,
			customer_id: attributes.customer_id,
			// For one-time payments, set a far future date (year 2099)
			current_period_end: isOneTime ? '2099-12-31T23:59:59Z' : attributes.ends_at,
			current_period_start: attributes.created_at || new Date().toISOString(),
			is_lifetime: isOneTime
		})
		.select();

	console.log('New subscription created:', newSub);

	return json({ status: 'success' });
};

// Function to handle subscription deletion
const subscriptionDeleted = async (data: any) => {
	await supabaseClient
		.from('subscriptions')
		.delete()
		.eq('lemonsqueezy_subscription_id', data.attributes.subscription_id);
	return json({ status: 'success' });
};

// Function to handle subscription updates
const subscriptionUpdated = async (data: any) => {
	const { attributes } = data;
	const sub = await supabaseClient
		.from('subscriptions')
		.select()
		.eq('lemonsqueezy_subscription_id', attributes.subscription_id)
		.single();

	if (!sub.data) return subscriptionCreated(data);

	await supabaseClient
		.from('subscriptions')
		.update({
			current_period_end: attributes.ends_at,
			current_period_start: attributes.renews_at,
			status: attributes.status
		})
		.eq('lemonsqueezy_subscription_id', attributes.subscription_id);

	return json({ status: 'success' });
};

// Function to handle one-time purchase
const orderCreated = async (data: any) => {
	const { attributes } = data;
	const userEmail = attributes.user_email;

	// First check if user exists in profiles
	const user = await supabaseClient.from('profiles').select().eq('email', userEmail).single();

	let userData = user.data;
	if (!userData?.email) {
		// Create new user if doesn't exist
		const newUser = await supabaseClient.auth.admin.createUser({
			email: userEmail
		});
		if (!newUser.data.user) return jsonError('User not found', 400);

		// Create profile entry for new user
		const { data: profileData, error: profileError } = await supabaseClient
			.from('profiles')
			.insert({
				id: newUser.data.user.id,
				email: userEmail,
				user_id: newUser.data.user.id
			})
			.select()
			.single();

		if (profileError) return jsonError('Failed to create profile', 400);
		userData = profileData;
	}

	if (!userData?.email) return jsonError('User not found', 400);

	const newSub = await supabaseClient
		.from('subscriptions')
		.insert({
			user_email: userData.email,
			user_id: userData.id,
			lemonsqueezy_subscription_id: attributes.order_id.toString(),
			status: 'active',
			customer_id: attributes.customer_id,
			current_period_end: '2099-12-31T23:59:59Z',
			current_period_start: attributes.created_at,
			is_lifetime: true
		})
		.select();

	console.log('New lifetime subscription created:', newSub);

	return json({ status: 'success' });
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

	const event = JSON.parse(rawBody);

	try {
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
				return json({ status: 'ok' });
		}
	} catch (err) {
		console.error(err);
		return jsonError(`Webhook Error: ${(err as Error).message}`, 400);
	}
}) satisfies RequestHandler;
