'use server';

import { USER_ROLES } from '../../shared/constants';
import MembersService from '../services/members.service';
import { invalidateGallery } from '../services/gallery.cache';
import { invalidateMembers } from '../services/members.cache';
import { childActions } from '../utils/childActions';
import { refreshOnSuccess } from '../utils/refreshOnSuccess';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];
const FORM_FIELDS = { booleans: ['active'] };

const refresh = refreshOnSuccess(invalidateMembers, [
	'/dashboard/members',
	'layout',
]);

export async function createMember(_prevState, formData) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () =>
			MembersService.create(formDataToObject(formData, FORM_FIELDS)),
		),
	);
}

export async function updateMember(_prevState, formData) {
	const { id, ...changes } = formDataToObject(formData, FORM_FIELDS);

	return refresh(
		await guardedRequest(ADMIN_ONLY, () =>
			MembersService.update(Number(id), changes),
		),
	);
}

// La baja toca tres dominios: miembros, formación y etiquetas de galería
const refreshDeparture = refreshOnSuccess(
	() => {
		invalidateMembers();
		invalidateGallery();
	},
	['/dashboard/members', 'layout'],
	['/dashboard/lineup'],
	['/dashboard/gallery', 'layout'],
);

export async function deactivateMember(_prevState, formData) {
	const { id, ...departure } = formDataToObject(formData);

	return refreshDeparture(
		await guardedRequest(ADMIN_ONLY, () =>
			MembersService.deactivate(Number(id), departure),
		),
	);
}

export async function deleteMember(id) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => MembersService.delete(Number(id))),
	);
}

const CHILD_OPTIONS = { roles: ADMIN_ONLY, refresh, formFields: {} };
const links = childActions(MembersService.links, CHILD_OPTIONS);
const images = childActions(MembersService.images, CHILD_OPTIONS);

export async function createMemberLink(prevState, formData) {
	return links.create(prevState, formData);
}

export async function updateMemberLink(prevState, formData) {
	return links.update(prevState, formData);
}

export async function deleteMemberLink(id) {
	return links.remove(id);
}

export async function createMemberImage(prevState, formData) {
	return images.create(prevState, formData);
}

export async function updateMemberImage(prevState, formData) {
	return images.update(prevState, formData);
}

export async function deleteMemberImage(id) {
	return images.remove(id);
}
