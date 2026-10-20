import { SITE } from './site';

const INDEXABLE = { index: true, follow: true };
const HIDDEN = { index: false, follow: false };

const socialImage = (alt) => ({ ...SITE.image, alt: alt ?? SITE.image.alt });

function resolveTitle(title) {
	return typeof title === 'string'
		? SITE.titleTemplate.replace('%s', title)
		: title.absolute;
}

export function humanizeSlug(slug) {
	return decodeURIComponent(String(slug))
		.replace(/[-_]+/g, ' ')
		.replace(
			/(^|\s)(\p{L})/gu,
			(_, start, letter) => start + letter.toUpperCase(),
		);
}

export const rootMetadata = {
	metadataBase: new URL(SITE.url),
	title: { default: SITE.defaultTitle, template: SITE.titleTemplate },
	description: SITE.defaultDescription,
	applicationName: SITE.name,
	authors: [{ name: SITE.name, url: SITE.url }],
	creator: SITE.name,
	publisher: SITE.name,
	formatDetection: { email: false, address: false, telephone: false },
	openGraph: {
		type: 'website',
		siteName: SITE.name,
		locale: SITE.locale,
		images: [socialImage()],
	},
	twitter: {
		card: 'summary',
		site: SITE.twitterHandle,
		creator: SITE.twitterHandle,
		images: [socialImage()],
	},
};

/**
 * Contenido de una página (src/frontend/seo/pages):
 * @typedef {Object} PageMeta
 * @property {string | { absolute: string }} title  string usa la plantilla "%s | Daliah Banda"; { absolute } no
 * @property {string} description
 * @property {string} path  ruta de la página ("/live"); se resuelve contra metadataBase
 * @property {string[]} [keywords]
 * @property {boolean} [indexable]  false → noindex (página sin contenido todavía) y sin canonical
 * @property {import('next').Metadata['robots']} [robots]  sustituye las reglas por defecto
 * @property {Record<string, unknown>} [openGraph]  sobrescribe campos (imageAlt cambia el alt de la imagen)
 * @property {Record<string, unknown>} [twitter]  sobrescribe campos
 */

/**
 * Convierte el contenido de una página en el objeto `metadata` de Next. Next no combina
 * objetos anidados entre layout y página, así que openGraph y twitter salen completos aquí.
 * @param {PageMeta} page
 * @returns {import('next').Metadata}
 */
export function buildMetadata(page) {
	const {
		title,
		description,
		path,
		keywords,
		indexable = true,
		robots,
		openGraph = {},
		twitter = {},
	} = page;
	const pageTitle = resolveTitle(title);
	const { imageAlt, ...openGraphOverrides } = openGraph;

	return {
		title,
		description,
		keywords,
		...(indexable && { alternates: { canonical: path } }),
		robots: indexable ? (robots ?? INDEXABLE) : HIDDEN,
		openGraph: {
			type: 'website',
			url: path,
			siteName: SITE.name,
			locale: SITE.locale,
			title: pageTitle,
			description,
			images: [socialImage(imageAlt)],
			...openGraphOverrides,
		},
		twitter: {
			card: 'summary',
			site: SITE.twitterHandle,
			creator: SITE.twitterHandle,
			title: pageTitle,
			description,
			images: [socialImage(imageAlt)],
			...twitter,
		},
	};
}
