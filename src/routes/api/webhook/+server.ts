import { PRIVATE_SUPABASE_KEY, STRIPE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '@/lib/database.types';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

const supabaseClient = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_3a714e1d9a932939473c253261ae54aae868daeb340d403b8d1346ab3524a68d';

const jsonError = (message: string, status: number) =>
	json({ error: message }, { status, headers: { 'content-type': 'application/json' } });

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15', typescript: true });

const subscriptionCreated = async (subscription: Stripe.Subscription) => {
	const customer = await stripe.customers.retrieve(subscription.customer as string);

	if (customer.deleted) return jsonError('Customer is deleted', 400);
	if (!customer.email) return jsonError('Customer has no email', 400);

	const user = await supabaseClient.from('profiles').select().eq('email', customer.email).single();
	// const user = await prisma.user.findUnique({ where: { email: customer.email } });
	if (!user.data?.email) return jsonError('User not found', 400);

	await supabaseClient.from('subscriptions').insert({
		user_email: user.data.email,
		user_id: user.data.id,
		stripe_subsription_id: subscription.id,
		status: subscription.status,
		customer_id: subscription.customer as string,
		current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
		current_period_start: new Date(subscription.current_period_start * 1000).toISOString()
	});

	return json({ status: 'success' });
};

const subscriptionDeleted = async (subscription: Stripe.Subscription) => {
	await supabaseClient.from('subscriptions').delete().eq('stripe_subscription_id', subscription.id);
	return json({ status: 'success' });
};

const subscriptionUpdated = async (subscription: Stripe.Subscription) => {
	const sub = await prisma.subscription.findUnique({
		where: {
			stripeSubscriptionId: subscription.id
		}
	});

	if (!sub) return subscriptionCreated(subscription);

	await prisma.subscription.update({
		data: {
			current_period_end: new Date(subscription.current_period_end * 1000),
			current_period_start: new Date(subscription.current_period_start * 1000),
			status: subscription.status
		},
		where: {
			stripeSubscriptionId: subscription.id
		}
	});

	return json({ status: 'success' });
};

export const POST = (async ({ request }) => {
	const sig = request.headers.get('stripe-signature');
	const rawBody = await request.text();

	let event;

	if (!sig)
		return json(
			{ error: 'No signature' },
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);

	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

		// if (event.type === 'customer.subscription.created')
		// 	return subscriptionCreated(event.data.object as Stripe.Subscription);

		if (event.type === 'customer.subscription.deleted')
			return subscriptionDeleted(event.data.object as Stripe.Subscription);

		if (event.type === 'customer.subscription.updated')
			return subscriptionUpdated(event.data.object as Stripe.Subscription);
	} catch (err) {
		console.log(err);

		return json(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			{ error: `Webhook Error: ${err?.message}` },
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	return json({});
}) satisfies RequestHandler;
