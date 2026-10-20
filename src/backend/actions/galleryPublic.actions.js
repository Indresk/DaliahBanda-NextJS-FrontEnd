'use server';

import { getGalleryPage } from '../services/gallery.cache';
import { internalRequestWrapper } from '../utils/internalRequestWrapper';

// Siguiente página de la galería pública ("Ver más"). No exige sesión: solo lee imágenes
// activas y acepta únicamente los filtros públicos.
export async function loadMoreGalleryImages({ category, eventId, memberSlugs, cursor } = {}) {
	const result = await internalRequestWrapper(getGalleryPage, [
		{ category, eventId, memberSlugs, cursor },
	]);

	return result.status === 'error'
		? { status: 'error', message: result.message }
		: { status: 'success', payload: result };
}
