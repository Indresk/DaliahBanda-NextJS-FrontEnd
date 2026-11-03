import { ARTICLES } from '../constants';

// Rutas públicas de la sección de artículos (/manifiestos)
export const articlePath = (slug) => `${ARTICLES.BASE_PATH}/${slug}`;
export const articleTagPath = (tagSlug) => `${ARTICLES.BASE_PATH}/etiqueta/${tagSlug}`;

// Listado paginado, de todos los artículos o de una etiqueta. La página 1 es la raíz del listado.
export function articlesPagePath(page = 1, tagSlug = null) {
	const base = tagSlug ? articleTagPath(tagSlug) : ARTICLES.BASE_PATH;
	return page > 1 ? `${base}/pagina/${page}` : base;
}
