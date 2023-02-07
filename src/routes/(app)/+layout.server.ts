import { prisma } from '@/lib/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();

	if (session?.user?.email) {
		const subscription = await prisma.subscription.findUnique({
			where: {
				userEmail: session.user.email
			}
		});

		// console.log('subscription', subscription);

		return {
			session,
			subscription
		};
	}
	return {
		session: session,
		subscription: null
	};
};
