import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	return {
		session: null,
		subscription: null,
		lemonSqueezySubscription: null,
		customerPortalUrl: null
	};
};
