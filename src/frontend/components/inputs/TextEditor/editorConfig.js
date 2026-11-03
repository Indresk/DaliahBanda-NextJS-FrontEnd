import { blockStyle, blockquote, embed, image, link, list_bulleted, list_numbered } from 'suneditor/plugins';
import es from 'suneditor/langs/es';
import { YOUTUBE_PATTERN, youtubeEmbedUrl } from '@/frontend/utils/richText';

// Plugins que usa el editor (solo los necesarios: cada uno suma peso)
const plugins = { blockStyle, blockquote, embed, image, link, list_bulleted, list_numbered };

const buttonList = [
	['undo', 'redo'],
	'|',
	['blockStyle'],
	['bold', 'italic', 'underline'],
	'|',
	['list_bulleted', 'list_numbered', 'blockquote'],
	'|',
	['link', 'image', 'embed'],
];

// Opciones de SunEditor para el campo de texto enriquecido del dashboard:
//  - Imágenes: solo por URL (sin subir archivos); el modal pide el texto alternativo.
//  - Incrustar: URL de YouTube (se convierte en iframe) o código <iframe> de cualquier sitio https.
//  - Títulos: solo H2 y H3 (el H1 es el de la página).
export function buildEditorOptions({ value, minHeight, onChange }) {
	return {
		plugins,
		lang: es,
		theme: 'dark',
		value,
		width: '100%',
		height: 'auto',
		minHeight,
		buttonList,
		blockStyle: { items: ['p', 'h2', 'h3'] },
		image: {
			createFileInput: false,
			createUrlInput: true,
			allowMultiple: false,
		},
		embed: {
			// Tamaño inicial de un video o iframe: todo el ancho. Para que sea proporcional en el
			// sitio público conviene fijar `aspect-ratio: 16 / 9` a `.se-embed-container iframe`.
			defaultWidth: '100%',
			defaultHeight: '420px',
			embedQuery: {
				youtube: { pattern: YOUTUBE_PATTERN, action: youtubeEmbedUrl, tag: 'iframe' },
			},
			// Código <iframe> pegado: se acepta cualquier origen https
			urlPatterns: [/^https:\/\//i],
			iframeTagAttributes: { loading: 'lazy' },
		},
		events: { onChange },
	};
}
