import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * Handler for POST requests to /api/playlist
 * Adds a new playlist to the user's playlists
 */
export const POST = (async ({ request }) => {
	const { title, group, data } = await request.json();

	console.log({ title, group, data });

	return json({});
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
 * Handler for DELETE requests to /api/playlist
 * Deletes a playlist from the user's playlists
 */
export const DELETE = (async ({ request }) => {
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
