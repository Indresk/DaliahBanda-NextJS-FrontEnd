'use server';

import { revalidatePath } from 'next/cache';
import { USER_ROLES } from '../../shared/constants';
import GalleryImagesService from '../services/galleryImages.service';
import { invalidateGallery } from '../services/gallery.cache';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];
const FORM_FIELDS = { lists: ['memberSlugs'], booleans: ['active'] };

// Tras cualquier cambio: se invalida la caché pública y se refresca el dashboard
function refresh(result) {
	if (result.status === 'success') {
		invalidateGallery();
		revalidatePath('/dashboard/gallery', 'layout');
	}
	return result;
}

export async function createGalleryImage(_prevState, formData) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () =>
			GalleryImagesService.create(formDataToObject(formData, FORM_FIELDS)),
		),
	);
}

export async function updateGalleryImage(_prevState, formData) {
	const { id, ...changes } = formDataToObject(formData, FORM_FIELDS);

	return refresh(
		await guardedRequest(ADMIN_ONLY, () => GalleryImagesService.update(Number(id), changes)),
	);
}

// Subida en lote: las imágenes ya están en el bucket; aquí se registran en la galería
export async function createGalleryImagesBatch(batch) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => GalleryImagesService.createMany(batch)),
	);
}

// changes: { active?, category?, eventId?, takenAt?, members?: { mode, slugs } }
export async function bulkUpdateGalleryImages({ ids, changes }) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => GalleryImagesService.bulkUpdate(ids, changes)),
	);
}

export async function deleteGalleryImages({ ids, alsoDeleteFiles = false }) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () =>
			GalleryImagesService.remove(ids, { alsoDeleteFiles: alsoDeleteFiles === true }),
		),
	);
}
