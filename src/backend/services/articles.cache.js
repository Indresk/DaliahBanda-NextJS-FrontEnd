import 'server-only';

import { ARTICLES } from '../../shared/constants';
import { createTaggedCache } from '../utils/taggedCache';
import ArticlesService from './articles.service';

// Lecturas públicas de los artículos. Las acciones del dashboard las invalidan con invalidateArticles().
// Los artículos recomendados son aleatorios, pero fijos entre regeneraciones (como máximo 15 min):
// así la página sigue siendo estática y los enlaces internos no cambian en cada visita.
const cache = createTaggedCache({ tag: ARTICLES.CACHE_TAG, revalidate: ARTICLES.CACHE_FALLBACK_SECONDS });

// Página del listado: (número de página, slug de etiqueta o null)
export const getArticlesPage = cache.wrap(
	async (page, tagSlug) => ArticlesService.getPage({ page, tagSlug }),
	['articles-page'],
);

// Artículo publicado por slug (null si no existe o es borrador)
export const getArticle = cache.wrap(async (slug) => ArticlesService.getBySlug(slug), ['article']);

export const getArticleNeighbors = cache.wrap(
	async (id, publishedAt) => ArticlesService.getNeighbors({ id, publishedAt }),
	['article-neighbors'],
);

export const getRelatedArticles = cache.wrap(async (id) => ArticlesService.getRelated(id), ['article-related']);

// Etiquetas con artículos publicados y cuántos tienen
export const getArticleTags = cache.wrap(async () => ArticlesService.listTags(), ['article-tags']);

// Todos los publicados (sitemap y feed)
export const getArticlesIndex = cache.wrap(async () => ArticlesService.listForIndex(), ['articles-index']);

export const invalidateArticles = cache.invalidate;
