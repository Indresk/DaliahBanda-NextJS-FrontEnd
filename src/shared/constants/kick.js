export const KICK = Object.freeze({
	LIVE_EVENT: Object.freeze({ name: 'livestream.status.updated', version: 1 }),
	SCOPES: 'events:subscribe livestream:read',
	AUTH_URL: 'https://id.kick.com/oauth/authorize',
	TOKEN_URL: 'https://id.kick.com/oauth/token',
	API_URL: 'https://api.kick.com/public/v1',
	// Se renueva el access token si le quedan menos de estos segundos
	TOKEN_EXPIRY_MARGIN_SECONDS: 120,
	// Cookie (cifrada) que enlaza el inicio del OAuth con su callback
	OAUTH_COOKIE: 'kick_oauth',
	OAUTH_COOKIE_PATH: '/api/v1/kick/oauth',
	OAUTH_MAX_AGE_SECONDS: 600,
});
