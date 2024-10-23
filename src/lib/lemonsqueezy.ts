import { LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID } from '$env/static/private';
import {
	getCustomer,
	getSubscription,
	lemonSqueezySetup,
	listCustomers
} from '@lemonsqueezy/lemonsqueezy.js';
import got from 'got';
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

const storeId = LEMONSQUEEZY_STORE_ID;

export const lemonClient = ky.extend({
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
		return listCustomers({
			filter: {
				email,
				storeId
			},
			include: ['subscriptions']
		}).then((res) => res.data?.data);
	},
	getActiveSubscription: async (input: { customerId: string } | { email?: string }) => {
		let customerSubscriptions:
			| {
					id: string;
					type: string;
			  }[]
			| undefined;

		if ('customerId' in input) {
			customerSubscriptions = await getCustomer(input.customerId, {
				include: ['subscriptions']
			}).then((r) => r.data?.data.relationships.subscriptions.data);
		} else {
			if (!input.email) return [];

			customerSubscriptions = await listCustomers({
				filter: { email: input.email },
				include: ['subscriptions']
			}).then(
				(r) =>
					r.data?.data.find((c) => c.attributes.email === input.email)?.relationships.subscriptions
						.data
			);
		}

		const subscriptions = await Promise.all(
			customerSubscriptions?.map((subscription) =>
				getSubscription(subscription.id).then((r) => r.data?.data)
			) ?? []
		);

		const activeSubscription = subscriptions.find((s) => s?.attributes.status === 'active');

		return activeSubscription;
	}
};
