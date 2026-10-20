import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { KICK } from '../../shared/constants';
import {
	createLiveSubscription,
	deleteSubscriptions,
	listSubscriptions,
} from '../integrations/kick.client';
import successResponseWrapper from '../utils/successResponseWrapper';
import KickCredentialsService from './kickCredentials.service';

async function listLiveSubscriptions(accessToken) {
	const subscriptions = await listSubscriptions(accessToken);
	return subscriptions.filter((item) => item.event === KICK.LIVE_EVENT.name);
}

// Suscripción de Kick al evento de estado de transmisión (el que llama a nuestro webhook)
class KickSubscriptionService {
	static async verify() {
		const accessToken = await KickCredentialsService.getValidAccessToken();
		const live = await listLiveSubscriptions(accessToken);

		return successResponseWrapper(
			{
				active: live.length > 0,
				subscriptions: live.map((item) => ({
					id: item.id,
					event: item.event,
					version: item.version,
					method: item.method,
					createdAt: item.created_at,
				})),
			},
			live.length > 0
				? 'La suscripción a eventos de transmisión está activa'
				: 'No hay suscripción activa a eventos de transmisión',
		);
	}

	// Deja exactamente una suscripción: borra las existentes y crea una nueva
	static async resubscribe() {
		const accessToken = await KickCredentialsService.getValidAccessToken();

		const existing = await listLiveSubscriptions(accessToken);
		await deleteSubscriptions(
			accessToken,
			existing.map((item) => item.id),
		);

		const created = await createLiveSubscription(accessToken);
		const failed = (created?.data ?? []).find((item) => item.error);
		if (failed) {
			throw new AppError(ERROR_CODES.KICK_API_ERROR, null, {
				error: failed.error,
			});
		}

		return successResponseWrapper(null, 'Suscripción creada');
	}
}

export default KickSubscriptionService;
