import 'server-only';

import { revalidateTag, unstable_cache } from 'next/cache';
import { GALLERY } from '../../shared/constants';
import GalleryEventsService from './galleryEvents.service';
import GalleryImagesService from './galleryImages.service';
import GalleryPeopleService from './galleryPeople.service';

// Lecturas de la galería pública para el HTML estático. Cada combinación de argumentos
// (filtros, cursor, slug) se guarda por separado. Las acciones del dashboard invalidan la
// etiqueta con invalidateGallery(); `revalidate` es el respaldo.
const options = {
	tags: [GALLERY.CACHE_TAG],
	revalidate: GALLERY.CACHE_FALLBACK_SECONDS,
};

// { items, nextCursor } de imágenes activas
export const getGalleryPage = unstable_cache(
	async (filters) => GalleryImagesService.list(filters),
	['gallery-page'],
	options,
);

// Eventos con imágenes activas, con portada y cantidad
export const getGalleryEvents = unstable_cache(
	async () => GalleryEventsService.listPublic(),
	['gallery-events'],
	options,
);

export const getGalleryEvent = unstable_cache(
	async (slug) => GalleryEventsService.findBySlug(slug),
	['gallery-event'],
	options,
);

// Integrantes actuales (filtros de la galería)
export const getGalleryMembers = unstable_cache(
	async () => GalleryPeopleService.findMembers(),
	['gallery-members'],
	options,
);

export const getGalleryPerson = unstable_cache(
	async (slug) => GalleryPeopleService.findBySlug(slug),
	['gallery-person'],
	options,
);

export function invalidateGallery() {
	revalidateTag(GALLERY.CACHE_TAG, { expire: 0 });
}
