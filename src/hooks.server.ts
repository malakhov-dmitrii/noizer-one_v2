import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from '$env/static/private';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import PrismaClient from '$lib/prisma';

export const prisma = new PrismaClient();

export const handle = SvelteKitAuth({
	secret: JWT_SECRET,
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'jwt'
	},

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	providers: [GitHub({ clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET })]
});
