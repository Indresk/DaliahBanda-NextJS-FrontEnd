'use server';

import { USER_ROLES } from '../../shared/constants';
import LineupService from '../services/lineup.service';
import { invalidateMembers } from '../services/members.cache';
import { refreshOnSuccess } from '../utils/refreshOnSuccess';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];

const refresh = refreshOnSuccess(invalidateMembers, ['/dashboard/lineup']);

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
