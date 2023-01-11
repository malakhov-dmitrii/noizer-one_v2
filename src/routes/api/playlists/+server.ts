import { prisma } from '@/lib/prisma';
import { fail, json, type RequestHandler } from '@sveltejs/kit';

/**
 * Handler for POST requests to /api/playlist
 * Adds a new playlist to the user's playlists
 */
export const POST = (async ({ request, locals }) => {
	const { title, group, data } = await request.json();
	const session = await locals.getSession();
	if (!session?.user?.email) return json({ error: 'Not logged in', status: 401 });

	const playlist = await prisma.playlist.create({
		data: {
			sounds: data,
			title,
			group,
			user: {
				connect: {
					email: session.user.email
				}
			}
		}
	});

	return json({ playlist });
}) satisfies RequestHandler;

/**
 * Handler for PUT requests to /api/playlist
 * Allow to update a playlist, mark as favorite, etc
 */
export const PUT = (async ({ request }) => {
	const { a, b } = await request.json();
	return json(a + b);
}) satisfies RequestHandler;

/**
 * Handler for GET requests to /api/playlist
 * Returns a list of user playlists
 */
export const GET = (async ({ request }) => {
	return json({});
}) satisfies RequestHandler;
