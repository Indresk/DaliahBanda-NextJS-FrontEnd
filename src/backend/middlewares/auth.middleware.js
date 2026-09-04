import { NextResponse } from 'next/server';
import UserService from '../services/user.service';
import {
	USER_QUERY_FIELDS,
	USER_ROLES,
	USER_UPDATABLE_FIELDS,
} from '../../shared/constants';
import { internalRequestWrapper } from '../utils/internalRequestWrapper';
import AllowedEmailsService from '../services/allowedEmails.service';

export default function authMiddleware(middleware) {
	return async (request, event) => {
		if (!pathname.startsWith('/dashboard')) {
			return NextResponse.next();
		}

		const session = request.auth;
		if (!session?.user) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		// duplicar redirect para session.user.role ||
		// Podemos usar pathname.startsWith para verificar acceso a rutas concretas dentro de las rutas que declaramos en config

		return middleware(request, event);
	};
}

export const callbacks = {
	signIn: async ({ user, profile }) => {
		const emailValidated = await internalRequestWrapper(
			AllowedEmailsService.verifyEmail,
			[profile.email],
		);

		return emailValidated === true;
		// return true;
	},
	jwt: async ({ token, user }) => {
		if (user) {
			const dbUser = await internalRequestWrapper(UserService.findOneBy, [
				USER_QUERY_FIELDS.EMAIL,
				user.email,
			]);

			if (!dbUser) {
				await internalRequestWrapper(UserService.create, [
					user.email,
					USER_ROLES.USER,
				]);
			}

			if (dbUser && dbUser.googleId === null) {
				await internalRequestWrapper(UserService.update, [
					dbUser.id,
					USER_UPDATABLE_FIELDS.GOOGLEID,
					user.id,
				]);
			}

			token.role = dbUser?.role || USER_ROLES.USER;
		}
		return token;
	},
	session: async ({ session, token }) => {
		if (session.user) {
			session.user.role = token.role;
		}
		return session;
	},
};
