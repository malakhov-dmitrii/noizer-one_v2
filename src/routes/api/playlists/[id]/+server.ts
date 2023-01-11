import { prisma } from '@/lib/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * Handler for DELETE requests to /api/playlist
 * Deletes a playlist from the user's playlists
 */
export const DELETE = (async ({ request, params, locals }) => {
	const { id } = params;
	const session = await locals.getSession();

	if (!session?.user?.email) return json({ error: 'Not logged in', status: 401 });
	const playlist = await prisma.playlist.findUnique({
		where: { id },
		include: { user: true }
	});

	if (playlist?.user.email !== session.user.email)
		return json({ error: 'Not authorized', status: 401 });

	await prisma.playlist.delete({ where: { id } });

	return json({ id });
}) satisfies RequestHandler;
