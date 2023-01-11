import { SvelteKitAuth } from '@auth/sveltekit';

import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import Credentials from '@auth/core/providers/credentials';
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_ID,
	GOOGLE_SECRET,
	JWT_SECRET
} from '$env/static/private';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const handle = SvelteKitAuth({
	secret: JWT_SECRET,
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'jwt'
	},

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	providers: [
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		GitHub({ clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }),

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const token = await prisma.verificationToken.findUnique({
					where: { token: credentials.password }
				});

				if (token?.identifier === credentials.email) {
					const user = await prisma.user.findUnique({
						where: { email: credentials.email },
						select: {
							id: true,
							email: true,
							name: true,
							image: true
						}
					});
					return user;
				}

				return null;
			}
		})
	]
});
