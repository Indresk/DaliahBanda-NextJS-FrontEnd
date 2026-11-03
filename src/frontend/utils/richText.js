// Utilidades del texto enriquecido (HTML) que produce el editor.

const HAS_HTML_TAG = /<[a-z][\s\S]*>/i;
const MEDIA_TAGS = /<(img|iframe|video|audio|hr|table)\b/i;

const escapeHtml = (text) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Valor para cargar en el editor: el HTML se usa tal cual y el texto plano que había antes del
// editor (con saltos de línea) se convierte en párrafos, o el editor lo juntaría en uno solo.
export function toEditorHtml(value) {
	if (!value) return '';
	if (HAS_HTML_TAG.test(value)) return value;

	return value
		.split(/\n{2,}/)
		.map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
		.join('');
}

// El editor vacío deja `<p><br></p>`: se guarda como cadena vacía (campo sin contenido)
export function isEmptyEditorHtml(html) {
	if (!html) return true;
	if (MEDIA_TAGS.test(html)) return false;

	return html.replace(/<[^>]*>|&nbsp;|\s/g, '') === '';
}

// HTML del editor → texto plano en una línea (descripciones para buscadores); `maxLength` recorta con "…"
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

// youtube.com/watch?v=ID · youtu.be/ID · /shorts/ID · /live/ID · /embed/ID (con o sin https, www o m)
export const YOUTUBE_PATTERN =
	/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i;

// URL de YouTube → URL del iframe de inserción
export const youtubeEmbedUrl = (url) =>
	`https://www.youtube.com/embed/${url.trim().match(YOUTUBE_PATTERN)?.[1] ?? ''}`;
