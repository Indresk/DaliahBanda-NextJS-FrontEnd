import 'server-only';

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import config from './index';
import { callbacks } from '../middlewares/auth.middleware';

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			clientId: config.AUTH_GOOGLE_ID,
			clientSecret: config.AUTH_GOOGLE_SECRET,
		}),
	],
	pages: { error: '/login' },
	callbacks: {
		signIn: callbacks.signIn,
		jwt: callbacks.jwt,
		session: callbacks.session,
	},
});
