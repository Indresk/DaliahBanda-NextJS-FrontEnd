import 'server-only';

import { revalidateTag, unstable_cache } from 'next/cache';
import { FLYERS } from '../../shared/constants';
import FlyersService from './flyers.service';

// Lectura pública del carrusel del home. Se invalida con invalidateFlyers().
export const getActiveFlyers = unstable_cache(
	async () => FlyersService.findActive(),
	['flyers-active'],
	{ tags: [FLYERS.CACHE_TAG], revalidate: FLYERS.CACHE_FALLBACK_SECONDS },
);

export function invalidateFlyers() {
	revalidateTag(FLYERS.CACHE_TAG, { expire: 0 });
}
