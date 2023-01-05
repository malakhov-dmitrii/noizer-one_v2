import PrismaClient from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export interface Todo {
	id: number;
	title: string;
	completed: boolean;
	userId: number;
}

export const load = (async ({ params, cookies, fetch }) => {
	const data = (await fetch('https://jsonplaceholder.typicode.com/todos').then((r) =>
		r.json()
	)) as Todo[];

	const prisma = new PrismaClient();
	const users = await prisma.user.findMany();
	// try {
	// 	const users = [];
	// } catch (error) {
	// 	console.log(error);
	// }

	return {
		data,
		users
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
