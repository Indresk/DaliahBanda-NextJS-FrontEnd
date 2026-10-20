import 'server-only';

import { NextResponse } from 'next/server';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { requireRole } from './sessionGuard';
import { publicUrl } from './publicUrl';

// Para rutas API que responden con redirecciones (OAuth): devuelve null si el usuario tiene
// el rol, o la redirección a donde corresponde (login si no hay sesión, dashboard si no tiene permiso).
export async function redirectUnlessRole(request, allowedRoles) {
	try {
		await requireRole(allowedRoles);
		return null;
	} catch (error) {
		const destination = error.code === ERROR_CODES.UNAUTHORIZED ? '/login' : '/dashboard';
		return NextResponse.redirect(publicUrl(destination, request));
	}
}
