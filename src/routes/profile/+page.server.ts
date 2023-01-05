import type { PageServerLoad } from '.$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user) {
		return {
			error: 'You must be logged in to view this page',
			status: 401
		};
	}
	return {};
};
