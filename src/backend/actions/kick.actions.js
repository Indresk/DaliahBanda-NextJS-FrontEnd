'use server';

import { revalidatePath } from 'next/cache';
import { DASHBOARD_ROLES, USER_ROLES } from '../../shared/constants';
import KickCredentialsService from '../services/kickCredentials.service';
import KickSubscriptionService from '../services/kickSubscription.service';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const PAGE = '/dashboard/stream';
const ADMIN_ONLY = [USER_ROLES.ADMIN];

// Los members pueden consultar; solo los admins modifican la integración
export async function verifyKickSubscription() {
	return await guardedRequest(DASHBOARD_ROLES, () =>
		KickSubscriptionService.verify(),
	);
}

export async function resubscribeKick() {
	const result = await guardedRequest(ADMIN_ONLY, () =>
		KickSubscriptionService.resubscribe(),
	);

	revalidatePath(PAGE);
	return result;
}

export async function disconnectKick() {
	const result = await guardedRequest(ADMIN_ONLY, () =>
		KickCredentialsService.clear(),
	);

	revalidatePath(PAGE);
	return result;
}
