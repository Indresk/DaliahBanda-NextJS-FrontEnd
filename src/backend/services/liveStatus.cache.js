import 'server-only';

import { revalidateTag, unstable_cache } from 'next/cache';
import { STREAM } from '../../shared/constants';
import StreamStatusService from './streamStatus.service';

// Estado en vivo para el HTML estático (Header y /live). El webhook de Kick invalida la
// etiqueta STREAM.STATUS_TAG y las páginas que la usan se regeneran con el valor nuevo.
// `revalidate` es el respaldo por si un webhook se pierde.
const getCachedLiveStatus = unstable_cache(
	async () => StreamStatusService.getPublicStatus(),
	['live-status'],
	{ tags: [STREAM.STATUS_TAG], revalidate: STREAM.CACHE_FALLBACK_SECONDS },
);

const OFFLINE = { isLive: false, title: null, startedAt: null };

// Si la base de datos falla, el sitio público sigue funcionando como "sin transmisión".
// El error se captura fuera de unstable_cache para que ese valor por defecto no se cachee.
export async function getLiveStatus() {
	try {
		return await getCachedLiveStatus();
	} catch (error) {
		console.error('No se pudo leer el estado en vivo', error.message);
		return OFFLINE;
	}
}

// Marca el estado como caducado: el siguiente visitante de cada página que lo usa recibe el
// HTML regenerado. { expire: 0 } evita servir una vez más el estado anterior.
export function invalidateLiveStatus() {
	revalidateTag(STREAM.STATUS_TAG, { expire: 0 });
}
