'use server';

import { revalidatePath } from 'next/cache';
import { USER_ROLES } from '../../shared/constants';
import AssetsService from '../services/assets.service';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const PAGE = '/dashboard/assets';
const ADMIN_ONLY = [USER_ROLES.ADMIN];

export async function createAssetUpload(upload) {
	return await guardedRequest(ADMIN_ONLY, () =>
		AssetsService.createUpload(upload),
	);
}

export async function confirmAssetUpload(token) {
	const result = await guardedRequest(ADMIN_ONLY, () =>
		AssetsService.confirmUpload(token),
	);

	revalidatePath(PAGE);
	return result;
}

export async function deleteAsset(key) {
	const result = await guardedRequest(ADMIN_ONLY, () =>
		AssetsService.remove(key),
	);

	if (result.status === 'success') revalidatePath(PAGE);
	return result;
}
