import 'server-only';

import { MEMBERS } from '../../shared/constants';
import { createTaggedCache } from '../utils/taggedCache';
import LineupService from './lineup.service';
import MembersService from './members.service';

// Miembros y formación comparten etiqueta: se invalidan juntos con invalidateMembers().
const cache = createTaggedCache({ tag: MEMBERS.CACHE_TAG, revalidate: MEMBERS.CACHE_FALLBACK_SECONDS });

// Miembros activos (home y página de integrantes)
export const getActiveMembers = cache.wrap(async () => MembersService.findActive(), ['members-active']);

// Miembro activo con enlaces e imágenes (null si no existe o no está activo)
export const getMember = cache.wrap(async (slug) => MembersService.findPublicBySlug(slug), ['member']);

// Línea del tiempo de la formación
export const getLineupTimeline = cache.wrap(async () => LineupService.findTimeline(), ['lineup-timeline']);

export const invalidateMembers = cache.invalidate;
