import { LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID } from '$env/static/private';
import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import ky from 'ky';

/**
 * Ensures that required environment variables are set and sets up the Lemon
 * Squeezy JS SDK. Throws an error if any environment variables are missing or
 * if there's an error setting up the SDK.
 */
export function configureLemonSqueezy() {
	lemonSqueezySetup({
		apiKey: LEMONSQUEEZY_API_KEY
	});
}

export const lemonClient = ky.create({
	prefixUrl: 'https://api.lemonsqueezy.com/v1',
	headers: {
		Accept: 'application/vnd.api+json',
		'Content-Type': 'application/vnd.api+json',
		Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`
	}
});

export const lemonApi = {
	listCustomers: (email?: string) => {
		if (!email) return [];
		return lemonClient
			.get(`customers?filter[email]=${email}&filter[store_id]=${LEMONSQUEEZY_STORE_ID}`)
			.json();
	}
};
