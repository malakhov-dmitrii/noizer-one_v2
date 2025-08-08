import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	return { playlists: [] };
}) satisfies PageServerLoad;
