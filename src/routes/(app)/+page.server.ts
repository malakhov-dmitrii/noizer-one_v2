import { supabaseClient } from '@/lib/db';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const playlist = new URL(event.request.url).searchParams.get('playlist');
	const session = await getServerSession(event);

	const playlistsRes = await supabaseClient
		.from('playlists')
		.select()
		.eq('user_id', session?.user.id);

	const selectedPlaylist = await supabaseClient
		.from('playlists')
		.select('*')
		.eq('id', playlist)
		.single();

	const playlists = playlistsRes.data ?? [];

	return { playlists: selectedPlaylist?.data ? [selectedPlaylist.data, ...playlists] : playlists };
}) satisfies PageServerLoad;
