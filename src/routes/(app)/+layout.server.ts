import type { LayoutServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutServerLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	const subscription = await supabaseClient
		.from('subscriptions')
		.select('*')
		.eq('user_id', session?.user.id)
		.single();

	return { session, subscription: subscription?.data };
};
