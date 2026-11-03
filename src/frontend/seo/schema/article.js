import { ARTICLES } from '@/shared/constants';
import { articlePath } from '@/shared/utils/articles';
import { SITE } from '../site';
import { MUSIC_GROUP_ID, articleSchemaId, memberPersonId } from './ids';

const url = (path) => `${SITE.url}${path}`;

// Autor: un miembro con página se refiere a su Person; el resto es una persona u organización por nombre
function buildAuthor(author) {
	if (author.memberSlug) {
		return {
			'@type': 'Person',
			'@id': memberPersonId(author.memberSlug),
			name: author.name,
			url: url(`/sobre-nosotros/integrantes/${author.memberSlug}`),
		};
	}
	return { '@type': author.kind === 'organization' ? 'Organization' : 'Person', name: author.name };
}

// Página de un artículo (article = resultado de getArticle). La fecha de publicación es la que ve el
// público; la de modificación, la última edición. Sin autores no hay `author` (queda la banda como publisher).
export function buildArticleSchema(article) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		'@id': articleSchemaId(article.slug),
		mainEntityOfPage: { '@type': 'WebPage', '@id': url(articlePath(article.slug)) },
		url: url(articlePath(article.slug)),
		headline: article.title,
		description: article.synopsis,
		image: [article.imageUrl],
		datePublished: article.displayDate,
		dateModified: article.updatedAt,
		inLanguage: SITE.language,
		publisher: { '@id': MUSIC_GROUP_ID },
		timeRequired: `PT${article.readingMinutes}M`,
		...(article.authors.length && { author: article.authors.map(buildAuthor) }),
		...(article.tags.length && { keywords: article.tags.map((tag) => tag.name).join(', ') }),
	};
}

// Listado de artículos (landing, páginas y etiquetas): una página de colección con la lista de enlaces
export function buildArticleListSchema({ articles, name, path }) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name,
		url: url(path),
		isPartOf: { '@type': 'Blog', name: 'Manifiestos', url: url(ARTICLES.BASE_PATH), publisher: { '@id': MUSIC_GROUP_ID } },
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: articles.map((article, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				url: url(articlePath(article.slug)),
				name: article.title,
			})),
		},
	};
}
