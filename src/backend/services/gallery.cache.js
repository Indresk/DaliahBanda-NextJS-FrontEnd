import 'server-only';

import { GALLERY } from '../../shared/constants';
import { createTaggedCache } from '../utils/taggedCache';
import GalleryEventsService from './galleryEvents.service';
import GalleryImagesService from './galleryImages.service';
import GalleryPeopleService from './galleryPeople.service';

// Lecturas de la galería pública para el HTML estático. Las acciones del dashboard las invalidan
// con invalidateGallery().
const cache = createTaggedCache({
	tag: GALLERY.CACHE_TAG,
	revalidate: GALLERY.CACHE_FALLBACK_SECONDS,
});

// { items, nextCursor } de imágenes activas
export const getGalleryPage = cache.wrap(
	async (filters) => GalleryImagesService.list(filters),
	['gallery-page'],
);

// Eventos con imágenes activas, con portada y cantidad
export const getGalleryEvents = cache.wrap(
	async () => GalleryEventsService.listPublic(),
	['gallery-events'],
);

export const getGalleryEvent = cache.wrap(
	async (slug) => GalleryEventsService.findBySlug(slug),
	['gallery-event'],
);

// Integrantes actuales (filtros de la galería)
export const getGalleryMembers = cache.wrap(
	async () => GalleryPeopleService.findMembers(),
	['gallery-members'],
);

export const getGalleryPerson = cache.wrap(
	async (slug) => GalleryPeopleService.findBySlug(slug),
	['gallery-person'],
);

export const invalidateGallery = cache.invalidate;
