import { prisma } from '@/lib/prisma';
import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutServerLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	const subsription = await supabaseClient
		.from('subcriptions')
		.select('*')
		.eq('user_id', session?.user.id)
		.single();

	return { session, subsription: subsription?.data };
};
