'use server';

import { revalidatePath } from 'next/cache';
import { USER_ROLES } from '../../shared/constants';
import GalleryEventsService from '../services/galleryEvents.service';
import { invalidateGallery } from '../services/gallery.cache';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];
const FORM_FIELDS = { booleans: ['isFeatured'] };

function refresh(result) {
	if (result.status === 'success') {
		invalidateGallery();
		revalidatePath('/dashboard/gallery', 'layout');
	}
	return result;
}

export async function createGalleryEvent(_prevState, formData) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () =>
			GalleryEventsService.create(formDataToObject(formData, FORM_FIELDS)),
		),
	);
}

export async function updateGalleryEvent(_prevState, formData) {
	const { id, ...changes } = formDataToObject(formData, FORM_FIELDS);

	return refresh(
		await guardedRequest(ADMIN_ONLY, () => GalleryEventsService.update(Number(id), changes)),
	);
}

export async function deleteGalleryEvent(id) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => GalleryEventsService.delete(Number(id))),
	);
}
