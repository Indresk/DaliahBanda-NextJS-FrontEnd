import 'server-only';

import config from '../config/index';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { KICK } from '../../shared/constants';

const REQUEST_TIMEOUT_MS = 10_000;

//  OAuth 2.1 (Authorization Code + PKCE)

export function buildAuthorizationUrl({ state, codeChallenge }) {
	const params = new URLSearchParams({
		response_type: 'code',
		client_id: config.KICK_CLIENT_ID,
		redirect_uri: config.KICK_REDIRECT_URI,
		scope: KICK.SCOPES,
		code_challenge: codeChallenge,
		code_challenge_method: 'S256',
		state,
	});
	return `${KICK.AUTH_URL}?${params.toString()}`;
}

async function requestToken(params) {
	const response = await fetch(KICK.TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: config.KICK_CLIENT_ID,
			client_secret: config.KICK_CLIENT_SECRET,
			...params,
		}),
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	if (!response.ok) {
		const body = await response.text();
		// 400/401 al renovar = el refresh token ya no sirve (revocado, rotado o vencido)
		const code =
			params.grant_type === 'refresh_token' && response.status < 500
				? ERROR_CODES.KICK_NOT_CONNECTED
				: ERROR_CODES.KICK_OAUTH_ERROR;
		throw new AppError(code, null, { status: response.status, body });
	}

	return await response.json();
}

export function exchangeCodeForToken(code, codeVerifier) {
	return requestToken({
		grant_type: 'authorization_code',
		code,
		redirect_uri: config.KICK_REDIRECT_URI,
		code_verifier: codeVerifier,
	});
}

export function refreshAccessToken(refreshToken) {
	return requestToken({
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
	});
}

//  API pública

async function apiRequest(path, accessToken, options = {}) {
	const response = await fetch(`${KICK.API_URL}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			...options.headers,
		},
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new AppError(ERROR_CODES.KICK_API_ERROR, null, {
			path,
			status: response.status,
			body,
		});
	}

	return response.status === 204 ? null : await response.json();
}

export async function createLiveSubscription(accessToken) {
	return await apiRequest('/events/subscriptions', accessToken, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			broadcaster_user_id: Number(config.KICK_BROADCASTER_ID),
			events: [KICK.LIVE_EVENT],
			method: 'webhook',
		}),
	});
}

export async function listSubscriptions(accessToken) {
	const query = new URLSearchParams({
		broadcaster_user_id: config.KICK_BROADCASTER_ID,
	});
	const result = await apiRequest(
		`/events/subscriptions?${query.toString()}`,
		accessToken,
	);
	return result?.data ?? [];
}

export async function deleteSubscriptions(accessToken, ids) {
	if (!ids.length) return;
	const query = new URLSearchParams();
	ids.forEach((id) => query.append('id', id));
	await apiRequest(`/events/subscriptions?${query.toString()}`, accessToken, {
		method: 'DELETE',
	});
}

// Llave pública para verificar webhooks

export async function fetchWebhookPublicKey() {
	const response = await fetch(`${KICK.API_URL}/public-key`, {
		headers: { Accept: 'application/json' },
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	if (!response.ok) {
		throw new AppError(ERROR_CODES.KICK_API_ERROR, null, {
			path: '/public-key',
			status: response.status,
		});
	}

	const result = await response.json();
	const publicKey = result?.data?.public_key;
	if (
		typeof publicKey !== 'string' ||
		!publicKey.includes('BEGIN PUBLIC KEY')
	) {
		throw new AppError(ERROR_CODES.KICK_API_ERROR, null, {
			path: '/public-key',
			reason: 'formato inesperado',
		});
	}

	return publicKey;
}
