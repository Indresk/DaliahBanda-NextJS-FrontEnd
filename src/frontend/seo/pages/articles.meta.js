import { ARTICLES } from '@/shared/constants';
import { articlePath, articlesPagePath } from '@/shared/utils/articles';
import { SITE } from '../site';

const FEED_PATH = `${ARTICLES.BASE_PATH}/feed.xml`;
const absolute = (path) => `${SITE.url}${path}`;
const withPage = (text, page) => (page > 1 ? `${text} (página ${page})` : text);

// Anterior/siguiente de un listado paginado (la página 1 es la raíz del listado)
const pagination = ({ page, totalPages, tagSlug }) => ({
	...(page > 1 && { previous: articlesPagePath(page - 1, tagSlug) }),
	...(page < totalPages && { next: articlesPagePath(page + 1, tagSlug) }),
});

// Landing /manifiestos y sus páginas numeradas. Cada página tiene su propio título, descripción y canonical.
export const articlesMeta = ({ page = 1, totalPages = 1 } = {}) => ({
	title: withPage('Manifiestos', page),
	description: withPage(
		'Manifiestos de Daliah Banda: artículos, ideas y posturas sobre música, escena alternativa y los temas de nuestras canciones.',
		page,
	),
	path: articlesPagePath(page),
	keywords: ['manifiestos', 'artículos', 'Daliah Banda', 'escena alternativa', 'rock'],
	alternates: { types: { 'application/rss+xml': absolute(FEED_PATH) } },
	pagination: pagination({ page, totalPages }),
});

// Artículos de una etiqueta (/manifiestos/etiqueta/[slug])
export const articleTagMeta = ({ tag, page = 1, totalPages = 1 }) => ({
	title: withPage(`Manifiestos sobre ${tag.name}`, page),
	description: withPage(
		`Artículos de Daliah Banda sobre ${tag.name}: ideas, posturas y reflexiones de la banda.`,
		page,
	),
	path: articlesPagePath(page, tag.slug),
	keywords: [tag.name, 'manifiestos', 'Daliah Banda'],
	alternates: { types: { 'application/rss+xml': absolute(FEED_PATH) } },
	pagination: pagination({ page, totalPages, tagSlug: tag.slug }),
});

// Artículo: el título del <title> es el del artículo, la descripción es la sinopsis y las etiquetas son
// las keywords. Open Graph tipo "article" con la imagen principal (sin recortar) para las redes sociales.
export const articleMeta = (article) => {
	const image = {
		url: article.imageUrl,
		width: article.imageWidth,
		height: article.imageHeight,
		alt: article.imageAlt,
	};

	return {
		title: article.title,
		description: article.synopsis,
		path: articlePath(article.slug),
		keywords: article.tags.map((tag) => tag.name),
		openGraph: {
			type: 'article',
			publishedTime: article.displayDate,
			modifiedTime: article.updatedAt,
			authors: article.authors.map((author) => author.name),
			tags: article.tags.map((tag) => tag.name),
			images: [image],
		},
		twitter: { card: 'summary_large_image', images: [{ url: image.url, alt: image.alt }] },
	};
};
