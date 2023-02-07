import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { omit } from 'lodash';

/**
 * Handler for DELETE requests to /api/playlist
 * Deletes a playlist from the user's playlists
 */
export const POST = (async ({ request, params, locals }) => {
	const { id } = params;
	const session = await locals.getSession();

	if (!session?.user?.email) return json({ error: 'Not logged in', status: 401 });
	const playlist = await prisma.playlist.findUnique({
		where: { id },
		include: { user: true }
	});

	// if (playlist?.user.email !== session.user.email)
	// 	return json({ error: 'Not authorized', status: 401 });
	if (!playlist) throw error(404, 'Playlist not found');

	// const copy = omit(playlist, ['id', 'userId', 'user']);
	await prisma.playlist.create({
		data: {
			sounds: playlist.sounds as Prisma.InputJsonValue,
			title: playlist.title,
			group: playlist.group,
			user: {
				connect: {
					email: session.user.email
				}
			}
		}
	});

	return json({ id });
}) satisfies RequestHandler;
