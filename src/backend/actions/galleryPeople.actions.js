'use server';

import { USER_ROLES } from '../../shared/constants';
import GalleryPeopleService from '../services/galleryPeople.service';
import { invalidateGallery } from '../services/gallery.cache';
import { refreshOnSuccess } from '../utils/refreshOnSuccess';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];
const FORM_FIELDS = { booleans: ['isMember'] };

const refresh = refreshOnSuccess(invalidateGallery, ['/dashboard/gallery', 'layout']);

export async function createGalleryPerson(_prevState, formData) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () =>
			GalleryPeopleService.create(formDataToObject(formData, FORM_FIELDS)),
		),
	);
}

export async function updateGalleryPerson(_prevState, formData) {
	const { id, ...changes } = formDataToObject(formData, FORM_FIELDS);

	return refresh(
		await guardedRequest(ADMIN_ONLY, () => GalleryPeopleService.update(Number(id), changes)),
	);
}

export async function deleteGalleryPerson(id) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => GalleryPeopleService.delete(Number(id))),
	);
}
