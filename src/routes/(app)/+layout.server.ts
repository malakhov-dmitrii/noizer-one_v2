import { dev } from '$app/environment';
import type { LayoutServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutServerLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	console.log({ dev });

	if (!session) {
		return { session };
	}

	const subscription = await supabaseClient
		.from('subscriptions')
		.select('*')
		.eq('user_id', session?.user.id)
		.single();

	console.log(
		'🚀 ~ file: +layout.server.ts:14 ~ constload:LayoutServerLoad= ~ subscription:',
		subscription,
		session?.user.id
	);

	return { session, subscription: subscription?.data };
};
