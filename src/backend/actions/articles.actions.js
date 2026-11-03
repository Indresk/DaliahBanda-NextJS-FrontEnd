'use server';

import { USER_ROLES } from '../../shared/constants';
import ArticlesService from '../services/articles.service';
import { invalidateArticles } from '../services/articles.cache';
import { refreshOnSuccess } from '../utils/refreshOnSuccess';
import { formDataToObject } from '../utils/formData';
import { guardedRequest } from '../utils/guardedRequestWrapper';

const ADMIN_ONLY = [USER_ROLES.ADMIN];

const refresh = refreshOnSuccess(invalidateArticles, ['/dashboard/articles', 'layout']);

export async function createArticle(_prevState, formData) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => ArticlesService.create(formDataToObject(formData))),
	);
}

export async function updateArticle(_prevState, formData) {
	const { id, ...changes } = formDataToObject(formData);

	return refresh(
		await guardedRequest(ADMIN_ONLY, () => ArticlesService.update(Number(id), changes)),
	);
}

// Publica o pasa a borrador desde la lista o la edición
export async function setArticleStatus(id, status) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => ArticlesService.setStatus(Number(id), status)),
	);
}

export async function deleteArticle(id) {
	return refresh(
		await guardedRequest(ADMIN_ONLY, () => ArticlesService.delete(Number(id))),
	);
}
