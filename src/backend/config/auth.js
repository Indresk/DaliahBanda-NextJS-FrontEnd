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
		// async signIn({ profile }) {
		// 	return true;
		// },
		// async jwt({ token, user }) {
		// 	if (user) {
		// 		// Logica de consulta de rol a DB
		// 		// const dbUser = null;
		// 		token.role = user.role || 'user'; // cambiar por string de Constants
		// 	}
		// 	return token;
		// },
		// async session({ session, token }) {
		// 	if (session.user) {
		// 		session.user.role = token.role;
		// 	}
		// 	return session;
		// },
	},
});
