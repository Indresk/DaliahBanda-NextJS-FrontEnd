'use server';

import { USER_ROLES } from '../../shared/constants';
import SongsService from '../services/songs.service';
import { invalidateMusic } from '../services/music.cache';
import { childActions } from '../utils/childActions';
import { refreshOnSuccess } from '../utils/refreshOnSuccess';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];
const FORM_FIELDS = { booleans: ['active', 'featured'] };

const refresh = refreshOnSuccess(invalidateMusic, ['/dashboard/music', 'layout']);

export async function createSong(_prevState, formData) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () =>
			SongsService.create(formDataToObject(formData, FORM_FIELDS)),
		),
	);
}

export async function updateSong(_prevState, formData) {
	const { id, ...changes } = formDataToObject(formData, FORM_FIELDS);

	return refresh(
		await guardedRequest(ADMIN_ONLY, () => SongsService.update(Number(id), changes)),
	);
}

export async function deleteSong(id) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => SongsService.delete(Number(id))),
	);
}

const options = { roles: ADMIN_ONLY, refresh, formFields: {} };
const links = childActions(SongsService.links, options);
const resources = childActions(SongsService.resources, options);

export async function createSongLink(prevState, formData) {
	return links.create(prevState, formData);
}

export async function updateSongLink(prevState, formData) {
	return links.update(prevState, formData);
}

export async function deleteSongLink(id) {
	return links.remove(id);
}

export async function createSongResource(prevState, formData) {
	return resources.create(prevState, formData);
}

export async function updateSongResource(prevState, formData) {
	return resources.update(prevState, formData);
}

export async function deleteSongResource(id) {
	return resources.remove(id);
}
