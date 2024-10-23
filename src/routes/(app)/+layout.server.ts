import { lemonApi } from '@/lib/lemonsqueezy';
import type { LayoutServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { getCustomer } from '@lemonsqueezy/lemonsqueezy.js';

export const load: LayoutServerLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	if (!session) {
		return { session };
	}

	const subscription = await supabaseClient
		.from('subscriptions')
		.select('*')
		.eq('user_id', session?.user.id)
		.single();

	const lemonSqueezySubscription = await lemonApi.getActiveSubscription({
		email: session?.user.email
	});

	const c = (await lemonApi.listCustomers(session?.user.email))?.[0];
	const customerPortalUrl = c
		? (await getCustomer(c.id)).data?.data.attributes.urls.customer_portal
		: null;

	return {
		session,
		subscription: subscription?.data,
		lemonSqueezySubscription,
		customerPortalUrl
	};
};
