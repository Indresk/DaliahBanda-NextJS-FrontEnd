'use server';

import { revalidatePath } from 'next/cache';
import { USER_ROLES } from '../../shared/constants';
import AllowedEmailsService from '../services/allowedEmails.service';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const PAGE = '/dashboard/emails';
const ADMIN_ONLY = [USER_ROLES.ADMIN];

export async function addAllowedEmail(_prevState, formData) {
	const result = await guardedRequest(ADMIN_ONLY, () =>
		AllowedEmailsService.create(formData.get('email')),
	);

	if (result.status === 'success') revalidatePath(PAGE);
	return result;
}

export async function removeAllowedEmail(email) {
	const result = await guardedRequest(ADMIN_ONLY, (admin) =>
		AllowedEmailsService.delete(email, admin.email),
	);

	if (result.status === 'success') revalidatePath(PAGE);
	return result;
}
