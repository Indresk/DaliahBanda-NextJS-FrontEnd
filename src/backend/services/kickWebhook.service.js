import 'server-only';

import config from '../config/index';
import { KICK } from '../../shared/constants';
import { kickLiveEventSchema } from '../../shared/schemas';
import { parseOrThrow } from '../utils/validate';
import StreamStatusService from './streamStatus.service';

// Resultado de procesar un evento: 'applied' | 'duplicate' | 'stale' | 'ignored'
class KickWebhookService {
	static async handleEvent({ eventType, payload, messageId, eventAt }) {
		if (eventType !== KICK.LIVE_EVENT.name) return 'ignored';

		const event = parseOrThrow(kickLiveEventSchema, payload);
		if (String(event.broadcaster.user_id) !== String(config.KICK_BROADCASTER_ID)) {
			return 'ignored';
		}

		return await StreamStatusService.applyEvent({
			eventId: messageId,
			eventAt,
			isLive: event.is_live,
			title: event.title,
			startedAt: event.started_at,
			endedAt: event.ended_at,
		});
	}
}

export default KickWebhookService;
