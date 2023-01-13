import { STRIPE_SECRET_KEY } from '$env/static/private';
import { prisma } from '@/lib/prisma';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_3a714e1d9a932939473c253261ae54aae868daeb340d403b8d1346ab3524a68d';

const jsonError = (message: string, status: number) =>
	json({ error: message }, { status, headers: { 'content-type': 'application/json' } });

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15', typescript: true });

const subscriptionCreated = async (subscription: Stripe.Subscription) => {
	const customer = await stripe.customers.retrieve(subscription.customer as string);

	if (customer.deleted) return jsonError('Customer is deleted', 400);
	if (!customer.email) return jsonError('Customer has no email', 400);

	const user = await prisma.user.findUnique({ where: { email: customer.email } });
	if (!user) return jsonError('User not found', 400);

	await prisma.subscription.create({
		data: {
			current_period_end: new Date(subscription.current_period_end * 1000),
			current_period_start: new Date(subscription.current_period_start * 1000),
			customerId: subscription.customer as string,
			status: subscription.status,
			stripeSubscriptionId: subscription.id,
			userEmail: user.email
		}
	});

	return json({ status: 'success' });
};

const subscriptionDeleted = async (subscription: Stripe.Subscription) => {
	await prisma.subscription.delete({
		where: {
			stripeSubscriptionId: subscription.id
		}
	});

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

// // server.js
// //
// // Use this sample code to handle webhook events in your integration.
// //
// // 1) Paste this code into a new file (server.js)
// //
// // 2) Install dependencies
// //   npm install stripe
// //   npm install express
// //
// // 3) Run the server on http://localhost:4242
// //   node server.js

// const stripe = require('stripe');
// const express = require('express');
// const app = express();

// app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
// 	const sig = request.headers['stripe-signature'];

// 	let event;

// 	try {
// 		event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
// 	} catch (err) {
// 		response.status(400).send(`Webhook Error: ${err.message}`);
// 		return;
// 	}

// 	// Handle the event
// 	switch (event.type) {
// 		case 'customer.subscription.created':
// 			const subscription = event.data.object;
// 			// Then define and call a function to handle the event customer.subscription.created
// 			break;
// 		case 'customer.subscription.deleted':
// 			const subscription = event.data.object;
// 			// Then define and call a function to handle the event customer.subscription.deleted
// 			break;
// 		case 'customer.subscription.trial_will_end':
// 			const subscription = event.data.object;
// 			// Then define and call a function to handle the event customer.subscription.trial_will_end
// 			break;
// 		case 'customer.subscription.updated':
// 			const subscription = event.data.object;
// 			// Then define and call a function to handle the event customer.subscription.updated
// 			break;
// 		case 'invoice.created':
// 			const invoice = event.data.object;
// 			// Then define and call a function to handle the event invoice.created
// 			break;
// 		case 'invoice.finalization_failed':
// 			const invoice = event.data.object;
// 			// Then define and call a function to handle the event invoice.finalization_failed
// 			break;
// 		case 'invoice.finalized':
// 			const invoice = event.data.object;
// 			// Then define and call a function to handle the event invoice.finalized
// 			break;
// 		case 'invoice.paid':
// 			const invoice = event.data.object;
// 			// Then define and call a function to handle the event invoice.paid
// 			break;
// 		case 'invoice.payment_action_required':
// 			const invoice = event.data.object;
// 			// Then define and call a function to handle the event invoice.payment_action_required
// 			break;
// 		case 'invoice.payment_failed':
// 			const invoice = event.data.object;
// 			// Then define and call a function to handle the event invoice.payment_failed
// 			break;
// 		case 'payment_intent.succeeded':
// 			const paymentIntent = event.data.object;
// 			// Then define and call a function to handle the event payment_intent.succeeded
// 			break;
// 		// ... handle other event types
// 		default:
// 			console.log(`Unhandled event type ${event.type}`);
// 	}

// 	// Return a 200 response to acknowledge receipt of the event
// 	response.send();
// });

// app.listen(4242, () => console.log('Running on port 4242'));
