import 'server-only';

import { STREAM } from '../../shared/constants';
import StreamStatusRepository from '../repositories/streamStatus.reposity';

const HOUR_MS = 60 * 60 * 1000;

function toIso(date) {
	return date ? new Date(date).toISOString() : null;
}

// Si se perdió el webhook de fin, se deja de mostrar "en vivo" pasado el tope
function isLiveNow(row) {
	if (!row?.isLive) return false;
	const since = row.startedAt ?? row.lastEventAt;
	if (!since) return false;
	return Date.now() - new Date(since).getTime() < STREAM.MAX_LIVE_HOURS * HOUR_MS;
}

class StreamStatusService {
	// Resultado de un evento: 'applied' | 'duplicate' | 'stale'
	static async applyEvent({ eventId, eventAt, isLive, title, startedAt, endedAt }) {
		return await StreamStatusRepository.applyEvent({
			eventId,
			eventAt,
			isLive,
			title: title ?? null,
			startedAt: startedAt ?? null,
			endedAt: endedAt ?? null,
		});
	}

	// Solo lo necesario para pintar el sitio público (sin ids ni fechas internas)
	static async getPublicStatus() {
		const row = await StreamStatusRepository.get();
		const isLive = isLiveNow(row);

		return {
			isLive,
			title: isLive ? (row.title ?? null) : null,
			startedAt: isLive ? toIso(row.startedAt) : null,
		};
	}

	static async getAdminStatus() {
		const row = await StreamStatusRepository.get();

		return {
			isLive: isLiveNow(row),
			storedIsLive: Boolean(row?.isLive),
			title: row?.title ?? null,
			startedAt: toIso(row?.startedAt),
			endedAt: toIso(row?.endedAt),
			lastEventAt: toIso(row?.lastEventAt),
		};
	}
}

export default StreamStatusService;
