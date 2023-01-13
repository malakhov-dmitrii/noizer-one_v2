import { prisma } from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export interface Todo {
	id: number;
	title: string;
	completed: boolean;
	userId: number;
}

export const load = (async ({ locals }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;

	if (email) {
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		const playlists = await prisma.playlist.findMany({
			where: {
				userId: user?.id
			}
		});

		return {
			playlists
		};
	}

	return {
		playlists: []
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	submitTodo: async (event) => {
		const data = await event.request.formData();
		const title = data.get('title');

		if (!title) return fail(400, { message: 'Title is required' });
		if (!!title && title.length < 3) {
			return fail(400, { title, message: 'Title must be at least 3 characters long' });
		}
	}
};
