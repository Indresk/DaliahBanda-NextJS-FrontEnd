import { NextResponse } from 'next/server';

export default function authMiddleware(middleware) {
	return async (request, event) => {
		const session = request.auth;
		console.log(request.auth);

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
		if (!profile.email) return false;
		// logica de comparación de correos admitidos por logear (si no estan admitidos retorna false)
		return true;
	},
	jwt: async ({ token, user }) => {
		if (user) {
			// Logica de consulta de rol a DB
			const dbUser = { role: null };
			token.role = dbUser.role || 'user'; // cambiar por string de Constants
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
