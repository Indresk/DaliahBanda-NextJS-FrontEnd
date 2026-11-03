import { getArticlesPage } from '@/back/services/articles.cache';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { articleTagMeta, articlesMeta } from '@/frontend/seo/pages/articles.meta';

// Metadatos de una página del listado (de todos los artículos o de una etiqueta); `{}` si no existe
// (la página responde 404)
export async function listingMetadata({ page, tagSlug = null }) {
	const data = await getArticlesPage(page, tagSlug);
	if (!data) return {};

	const info = { page: data.page, totalPages: data.totalPages };
	return buildMetadata(data.tag ? articleTagMeta({ tag: data.tag, ...info }) : articlesMeta(info));
}
