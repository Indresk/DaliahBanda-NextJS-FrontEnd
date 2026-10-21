import 'server-only';

import { FLYERS } from '../../shared/constants';
import { createTaggedCache } from '../utils/taggedCache';
import FlyersService from './flyers.service';

// Lectura pública del carrusel del home. Se invalida con invalidateFlyers().
const cache = createTaggedCache({ tag: FLYERS.CACHE_TAG, revalidate: FLYERS.CACHE_FALLBACK_SECONDS });

export const getActiveFlyers = cache.wrap(async () => FlyersService.findActive(), ['flyers-active']);

export const invalidateFlyers = cache.invalidate;
