export const ARTICLE_STATUS = Object.freeze({
	DRAFT: 'draft',
	PUBLISHED: 'published',
});

export const ARTICLE_STATUS_LABELS = Object.freeze({
	[ARTICLE_STATUS.DRAFT]: 'Borrador',
	[ARTICLE_STATUS.PUBLISHED]: 'Publicado',
});

// Un autor es un miembro de la banda (con enlace a su página) o un nombre escrito a mano; en los
// datos estructurados se distingue si el nombre escrito es una persona o una organización
export const AUTHOR_KINDS = Object.freeze({
	PERSON: 'person',
	ORGANIZATION: 'organization',
});

export const ARTICLES = Object.freeze({
	// Sección pública: /manifiestos (landing), /manifiestos/[slug] y sus páginas hijas
	BASE_PATH: '/manifiestos',
	// Etiqueta de la caché de Next de las lecturas públicas (ver articles.cache.js)
	CACHE_TAG: 'articles',
	CACHE_FALLBACK_SECONDS: 900,
	PAGE_SIZE: 10,
	// Artículos recomendados al lado de cada artículo (aleatorios entre los publicados)
	RELATED_COUNT: 3,
	MAX_TAGS: 12,
	MAX_TAG_LENGTH: 40,
	MAX_AUTHORS: 10,
	WORDS_PER_MINUTE: 200,
	// Segmentos que cuelgan de /manifiestos: un artículo no puede usarlos como slug
	RESERVED_SLUGS: Object.freeze(['pagina', 'etiqueta', 'feed', 'feed.xml']),
});
