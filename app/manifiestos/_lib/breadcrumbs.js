import { ARTICLES } from '@/shared/constants';
import { articlePath, articleTagPath } from '@/shared/utils/articles';

// Migas de la sección: Manifiestos / <etiqueta> / <artículo>. Las usan la franja visible y el JSON-LD.
export function articlesCrumbs({ tag, article } = {}) {
	const crumbs = [{ label: 'Manifiestos', href: ARTICLES.BASE_PATH }];
	if (tag) crumbs.push({ label: tag.name, href: articleTagPath(tag.slug) });
	if (article) crumbs.push({ label: article.title, href: articlePath(article.slug) });
	return crumbs;
}
