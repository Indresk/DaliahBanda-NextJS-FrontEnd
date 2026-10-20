import 'server-only';

import { revalidateTag, unstable_cache } from 'next/cache';
import { MEMBERS } from '../../shared/constants';
import MembersService from './members.service';

// Lectura pública (home y, a futuro, páginas personales). Las acciones del dashboard invalidan
// la etiqueta con invalidateMembers(); `revalidate` es el respaldo.
export const getActiveMembers = unstable_cache(
	async () => MembersService.findActive(),
	['members-active'],
	{ tags: [MEMBERS.CACHE_TAG], revalidate: MEMBERS.CACHE_FALLBACK_SECONDS },
);

export function invalidateMembers() {
	revalidateTag(MEMBERS.CACHE_TAG, { expire: 0 });
}
