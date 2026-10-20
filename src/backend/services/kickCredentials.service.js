import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { ENCRYPTION_PURPOSES, KICK } from '../../shared/constants';
import { refreshAccessToken } from '../integrations/kick.client';
import KickCredentialsRepository from '../repositories/kickCredentials.reposity';
import { decrypt, encrypt } from '../utils/encryption';
import successResponseWrapper from '../utils/successResponseWrapper';

const PURPOSE = ENCRYPTION_PURPOSES.KICK_TOKENS;

function expiresAtFrom(tokenData) {
	return new Date(Date.now() + Number(tokenData.expires_in ?? 0) * 1000);
}

class KickCredentialsService {
	// Guarda los tokens de una respuesta de /oauth/token
	static async store(tokenData, options = {}) {
		await KickCredentialsRepository.save(
			{
				refreshToken: encrypt(tokenData.refresh_token, PURPOSE),
				accessToken: encrypt(tokenData.access_token, PURPOSE),
				accessTokenExpiresAt: expiresAtFrom(tokenData),
				scope: tokenData.scope ?? KICK.SCOPES,
			},
			options,
		);
	}

	// Devuelve un access token vigente, renovándolo si está por vencer. La fila queda
	// bloqueada mientras se renueva: Kick rota el refresh token, y dos renovaciones
	// simultáneas dejarían la integración con un token ya invalidado
	static async getValidAccessToken() {
		return await KickCredentialsRepository.withLock(
			async (row, transaction) => {
				if (!row) throw new AppError(ERROR_CODES.KICK_NOT_CONNECTED);

				const margin = KICK.TOKEN_EXPIRY_MARGIN_SECONDS * 1000;
				const stillValid =
					row.accessToken &&
					row.accessTokenExpiresAt &&
					new Date(row.accessTokenExpiresAt).getTime() - Date.now() > margin;
				if (stillValid) return decrypt(row.accessToken, PURPOSE);

				const refreshToken = decrypt(row.refreshToken, PURPOSE);
				const tokenData = await refreshAccessToken(refreshToken);

				await KickCredentialsService.store(
					// Si Kick no devuelve un refresh token nuevo, se conserva el actual
					{
						...tokenData,
						refresh_token: tokenData.refresh_token ?? refreshToken,
						scope: tokenData.scope ?? row.scope,
					},
					{ transaction },
				);

				return tokenData.access_token;
			},
		);
	}

	static async getStatus() {
		const row = await KickCredentialsRepository.get();

		return {
			connected: Boolean(row),
			connectedAt: row?.createdAt ?? null,
			tokenUpdatedAt: row?.updatedAt ?? null,
			accessTokenExpiresAt: row?.accessTokenExpiresAt ?? null,
		};
	}

	static async clear() {
		await KickCredentialsRepository.clear();
		return successResponseWrapper(null, 'Kick desconectado');
	}
}

export default KickCredentialsService;
