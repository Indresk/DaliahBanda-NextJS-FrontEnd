import { ARTICLES } from '../constants';

// HTML del editor → texto plano en una línea (descripciones, tiempo de lectura); `maxLength` recorta con "…"
export function htmlToText(html, maxLength = 300) {
	const text = (html ?? '')
		.replace(/<(?:script|style|iframe)[\s\S]*?<\/(?:script|style|iframe)>/gi, ' ')
		.replace(/<\/(?:p|div|li|h[1-6]|blockquote)>|<br\s*\/?>/gi, ' ')
		.replace(/<[^>]*>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();

	return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

// Minutos de lectura del HTML de un artículo (mínimo 1)
export function readingMinutes(html) {
	const words = htmlToText(html, Infinity).split(' ').filter(Boolean).length;
	return Math.max(1, Math.ceil(words / ARTICLES.WORDS_PER_MINUTE));
}
