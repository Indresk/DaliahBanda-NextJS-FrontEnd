'use server';

import { USER_ROLES } from '../../shared/constants';
import AlbumsService from '../services/albums.service';
import { invalidateMusic } from '../services/music.cache';
import { childActions } from '../utils/childActions';
import { refreshOnSuccess } from '../utils/refreshOnSuccess';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];
const FORM_FIELDS = { booleans: ['active'] };

const refresh = refreshOnSuccess(invalidateMusic, ['/dashboard/music', 'layout']);

export async function createAlbum(_prevState, formData) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () =>
			AlbumsService.create(formDataToObject(formData, FORM_FIELDS)),
		),
	);
}

export async function updateAlbum(_prevState, formData) {
	const { id, ...changes } = formDataToObject(formData, FORM_FIELDS);

	return refresh(
		await guardedRequest(ADMIN_ONLY, () => AlbumsService.update(Number(id), changes)),
	);
}

export async function deleteAlbum(id) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => AlbumsService.delete(Number(id))),
	);
}

const links = childActions(AlbumsService.links, { roles: ADMIN_ONLY, refresh, formFields: {} });

export async function createAlbumLink(prevState, formData) {
	return links.create(prevState, formData);
}

export async function updateAlbumLink(prevState, formData) {
	return links.update(prevState, formData);
}

export async function deleteAlbumLink(id) {
	return links.remove(id);
}
