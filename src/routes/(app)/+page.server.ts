import { supabaseClient } from '@/lib/db';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';
import { LEMONSQUEEZY_API_KEY } from '$env/static/private';
import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

const apiKey = LEMONSQUEEZY_API_KEY;
await lemonSqueezySetup({ apiKey });

export const load = (async (event) => {
	// const posthog = new PostHog('phc_wnxpq76WlBx9sJ1rsF411RfLifcb2j2pZmACjrTXGug',
	// 	{ host: 'https://eu.i.posthog.com' });
	// 	posthog.capture({
	// 	  distinctId: 'distinct_id_of_the_user',
	// 	  event: 'event_name',
	// 	})
	// 	await posthog.shutdown()

	const playlist = new URL(event.request.url).searchParams.get('playlist');
	const session = await getServerSession(event);

	const playlistsRes = await supabaseClient
		.from('playlists')
		.select()
		.eq('user_id', session?.user.id);

	const selectedPlaylist = playlist
		? await supabaseClient.from('playlists').select('*').eq('id', playlist).single()
		: null;

	const playlists = playlistsRes.data ?? [];

	// const customer = await lemonApi.getActiveSubscription({ email: session?.user.email });

	// console.log('Customer:', customer);

	return { playlists: selectedPlaylist?.data ? [selectedPlaylist.data, ...playlists] : playlists };
}) satisfies PageServerLoad;
