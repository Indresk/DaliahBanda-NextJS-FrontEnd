import { NextResponse } from 'next/server';
import { USER_ROLES } from '@/shared/constants';
import KickOAuthService from '@/back/services/kickOAuth.service';
import {
	clearKickOAuthCookie,
	readKickOAuthCookie,
} from '@/back/utils/kickOAuthCookie';
import { redirectUnlessRole } from '@/back/utils/routeGuard';

function redirectToStream(request, result) {
	const url = new URL('/dashboard/stream', request.url);
	url.searchParams.set('kick', result);

	const response = NextResponse.redirect(url);
	clearKickOAuthCookie(response);
	return response;
}

// Kick redirige aquí con ?code&state. Exige sesión de admin además del state de la cookie.
export async function GET(request) {
	const denied = await redirectUnlessRole(request, [USER_ROLES.ADMIN]);
	if (denied) return denied;

	const { searchParams } = request.nextUrl;
	if (searchParams.get('error')) return redirectToStream(request, 'error');

	try {
		await KickOAuthService.complete({
			code: searchParams.get('code'),
			state: searchParams.get('state'),
			cookieValue: readKickOAuthCookie(request),
		});
		return redirectToStream(request, 'connected');
	} catch (error) {
		console.error('Error al conectar con Kick:', error.message, error.details);
		return redirectToStream(request, 'error');
	}
}
