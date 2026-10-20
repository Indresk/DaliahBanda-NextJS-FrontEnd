'use server';

import { revalidatePath } from 'next/cache';
import { USER_ROLES } from '../../shared/constants';
import FlyersService from '../services/flyers.service';
import { invalidateFlyers } from '../services/flyers.cache';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];
const FORM_FIELDS = { booleans: ['active'] };

function refresh(result) {
	if (result.status === 'success') {
		invalidateFlyers();
		revalidatePath('/dashboard/flyers');
	}
	return result;
}

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
