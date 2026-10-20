'use server';

import { revalidatePath } from 'next/cache';
import { USER_ROLES } from '../../shared/constants';
import LineupService from '../services/lineup.service';
import { invalidateMembers } from '../services/members.cache';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];

function refresh(result) {
	if (result.status === 'success') {
		invalidateMembers();
		revalidatePath('/dashboard/lineup');
	}
	return result;
}

export async function createLineupEntry(_prevState, formData) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => LineupService.create(formDataToObject(formData))),
	);
}

export async function updateLineupEntry(_prevState, formData) {
	const { id, ...fields } = formDataToObject(formData);

	return refresh(
		await guardedRequest(ADMIN_ONLY, () => LineupService.update(Number(id), fields)),
	);
}

export async function deleteLineupEntry(id) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => LineupService.delete(Number(id))),
	);
}
