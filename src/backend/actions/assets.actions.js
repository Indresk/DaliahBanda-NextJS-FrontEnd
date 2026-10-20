'use server';

import { revalidatePath } from 'next/cache';
import { USER_ROLES } from '../../shared/constants';
import AssetsService from '../services/assets.service';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const PAGE = '/dashboard/assets';
const ADMIN_ONLY = [USER_ROLES.ADMIN];

// Subida directa a R2 en dos pasos (el archivo no pasa por este servidor):
// 1) createAssetUpload devuelve una URL firmada; el navegador sube el archivo a R2.
// 2) confirmAssetUpload comprueba lo guardado y borra el archivo si no cumple.
export async function createAssetUpload(upload) {
	return await guardedRequest(ADMIN_ONLY, () => AssetsService.createUpload(upload));
}

export async function confirmAssetUpload(token) {
	const result = await guardedRequest(ADMIN_ONLY, () =>
		AssetsService.confirmUpload(token),
	);

	// Si el archivo se rechazó ya se borró de R2: la lista también debe actualizarse
	revalidatePath(PAGE);
	return result;
}

export async function deleteAsset(key) {
	const result = await guardedRequest(ADMIN_ONLY, () => AssetsService.remove(key));

	if (result.status === 'success') revalidatePath(PAGE);
	return result;
}
