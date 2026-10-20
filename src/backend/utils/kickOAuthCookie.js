import 'server-only';

import { KICK } from '../../shared/constants';

// Cookie que enlaza el inicio del OAuth de Kick con su callback (contiene el state y el
// verificador PKCE, ya cifrados). Solo viaja a las rutas del OAuth.
export function setKickOAuthCookie(response, value) {
	response.cookies.set(KICK.OAUTH_COOKIE, value, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: KICK.OAUTH_MAX_AGE_SECONDS,
		path: KICK.OAUTH_COOKIE_PATH,
	});
}

export function readKickOAuthCookie(request) {
	return request.cookies.get(KICK.OAUTH_COOKIE)?.value;
}

export function clearKickOAuthCookie(response) {
	response.cookies.delete({
		name: KICK.OAUTH_COOKIE,
		path: KICK.OAUTH_COOKIE_PATH,
	});
}
