import { NextResponse } from 'next/server';

import { auth } from '@/back/config/auth';

const proxy = auth((request) => {
	const session = request.auth;

	if (!session?.user) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// duplicar redirect para session.user.role ||
	// Podemos usar pathname.startsWith para verificar acceso a rutas concretas dentro de las rutas que declaramos en config

	return NextResponse.next();
});

export const config = {
	matcher: ['/dashboard/:path*'],
};

export default proxy;
