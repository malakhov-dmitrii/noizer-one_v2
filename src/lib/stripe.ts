import { STRIPE_API_KEY } from '$env/static/private';
import Stripe from 'stripe';

export const stripe = new Stripe(STRIPE_API_KEY, {
	apiVersion: '2022-11-15',
	typescript: true
});
