import { NextResponse } from 'next/server';
import { USER_ROLES } from '@/shared/constants';
import KickOAuthService from '@/back/services/kickOAuth.service';
import { setKickOAuthCookie } from '@/back/utils/kickOAuthCookie';
import { redirectUnlessRole } from '@/back/utils/routeGuard';

// Inicia la conexión con Kick (solo admin) y envía al usuario a la pantalla de autorización
export async function GET(request) {
	const denied = await redirectUnlessRole(request, [USER_ROLES.ADMIN]);
	if (denied) return denied;

	const { url, cookieValue } = KickOAuthService.start();

	const response = NextResponse.redirect(url);
	setKickOAuthCookie(response, cookieValue);
	return response;
}
