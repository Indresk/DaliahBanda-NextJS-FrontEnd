import 'server-only';

import { randomBytes, timingSafeEqual } from 'node:crypto';
import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { ENCRYPTION_PURPOSES, KICK } from '../../shared/constants';
import {
	buildAuthorizationUrl,
	exchangeCodeForToken,
} from '../integrations/kick.client';
import { decrypt, encrypt } from '../utils/encryption';
import { createPkcePair } from '../utils/pkce';
import successResponseWrapper from '../utils/successResponseWrapper';
import KickCredentialsService from './kickCredentials.service';
import KickSubscriptionService from './kickSubscription.service';

const PURPOSE = ENCRYPTION_PURPOSES.KICK_OAUTH_STATE;

function readState(cookieValue) {
	try {
		return JSON.parse(decrypt(cookieValue, PURPOSE));
	} catch {
		throw new AppError(ERROR_CODES.KICK_OAUTH_ERROR, 'Sesión de conexión inválida.');
	}
}

function sameState(expected, received) {
	const a = Buffer.from(String(expected));
	const b = Buffer.from(String(received));
	return a.length === b.length && timingSafeEqual(a, b);
}

// Conexión de la cuenta de Kick (OAuth 2.1 con PKCE)
class KickOAuthService {
	// Devuelve la URL de Kick y el valor (cifrado) de la cookie que enlaza el callback
	static start() {
		const { codeVerifier, codeChallenge } = createPkcePair();
		const state = randomBytes(16).toString('base64url');

		return {
			url: buildAuthorizationUrl({ state, codeChallenge }),
			cookieValue: encrypt(
				JSON.stringify({
					state,
					codeVerifier,
					expiresAt: Date.now() + KICK.OAUTH_MAX_AGE_SECONDS * 1000,
				}),
				PURPOSE,
			),
		};
	}

	static async complete({ code, state, cookieValue }) {
		if (!code || !state || !cookieValue) {
			throw new AppError(ERROR_CODES.KICK_OAUTH_ERROR, 'Faltan parámetros.');
		}

		const saved = readState(cookieValue);
		if (!sameState(saved.state, state) || Date.now() > saved.expiresAt) {
			throw new AppError(
				ERROR_CODES.KICK_OAUTH_ERROR,
				'La conexión expiró. Inténtalo de nuevo.',
			);
		}

		const tokenData = await exchangeCodeForToken(code, saved.codeVerifier);
		await KickCredentialsService.store(tokenData);

		// Un único suscriptor del evento: se limpian los anteriores y se crea el nuevo
		await KickSubscriptionService.resubscribe();

		return successResponseWrapper(null, 'Kick conectado y suscripción creada');
	}
}

export default KickOAuthService;
