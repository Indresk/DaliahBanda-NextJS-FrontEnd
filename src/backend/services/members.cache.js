import 'server-only';

import { revalidateTag, unstable_cache } from 'next/cache';
import { MEMBERS } from '../../shared/constants';
import LineupService from './lineup.service';
import MembersService from './members.service';

// Lectura pública (home y, a futuro, páginas personales). Las acciones del dashboard invalidan
// la etiqueta con invalidateMembers(); `revalidate` es el respaldo.
export const getActiveMembers = unstable_cache(
	async () => MembersService.findActive(),
	['members-active'],
	{ tags: [MEMBERS.CACHE_TAG], revalidate: MEMBERS.CACHE_FALLBACK_SECONDS },
);

// Miembro activo con enlaces e imágenes (null si no existe o no está activo)
export const getMember = unstable_cache(
	async (slug) => MembersService.findPublicBySlug(slug),
	['member'],
	{ tags: [MEMBERS.CACHE_TAG], revalidate: MEMBERS.CACHE_FALLBACK_SECONDS },
);

// Línea del tiempo de la formación (comparte etiqueta con los miembros: se invalidan juntos)
export const getLineupTimeline = unstable_cache(
	async () => LineupService.findTimeline(),
	['lineup-timeline'],
	{ tags: [MEMBERS.CACHE_TAG], revalidate: MEMBERS.CACHE_FALLBACK_SECONDS },
);

export function invalidateMembers() {
	revalidateTag(MEMBERS.CACHE_TAG, { expire: 0 });
}
