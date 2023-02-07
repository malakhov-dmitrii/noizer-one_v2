import { prisma } from '$lib/prisma';
import { fail, json } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, request }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;

	const playlist = new URL(request.url).searchParams.get('playlist');

	if (email) {
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		const playlists = await prisma.playlist.findMany({
			where: {
				userId: user?.id
			},
			include: {
				user: true
			}
		});

		let selectedPlaylist = null;
		if (playlist) {
			selectedPlaylist = await prisma.playlist
				.findUnique({
					where: {
						id: playlist
					},
					include: {
						user: true
					}
				})
				.catch(() => null);
		}

		return { playlists: selectedPlaylist ? [selectedPlaylist, ...playlists] : playlists };
	}

	return {
		playlists: []
	};
}) satisfies PageServerLoad;
