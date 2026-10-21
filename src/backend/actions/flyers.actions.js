'use server';

import { USER_ROLES } from '../../shared/constants';
import FlyersService from '../services/flyers.service';
import { invalidateFlyers } from '../services/flyers.cache';
import { refreshOnSuccess } from '../utils/refreshOnSuccess';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];
const FORM_FIELDS = { booleans: ['active'] };

const refresh = refreshOnSuccess(invalidateFlyers, ['/dashboard/flyers']);

export async function createFlyer(_prevState, formData) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () =>
			FlyersService.create(formDataToObject(formData, FORM_FIELDS)),
		),
	);
}

export async function updateFlyer(_prevState, formData) {
	const { id, ...changes } = formDataToObject(formData, FORM_FIELDS);

	return refresh(
		await guardedRequest(ADMIN_ONLY, () => FlyersService.update(Number(id), changes)),
	);
}

export async function deleteFlyer(id) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => FlyersService.delete(Number(id))),
	);
}
