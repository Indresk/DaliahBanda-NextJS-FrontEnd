// Utilidades de los scripts de fuentes: piden a Google Fonts la hoja CSS (con un navegador moderno
// como User-Agent para recibir woff2) y descargan el archivo de fuente indicado en ella.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const FONTS_DIR = path.resolve('public/fonts');

const USER_AGENT =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

async function get(url, { text = true } = {}) {
	const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
	if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
	return text ? await response.text() : Buffer.from(await response.arrayBuffer());
}

export const fetchText = (url) => get(url);

// Bloques @font-face de una hoja de Google Fonts: { subset, url } (subset sale del comentario previo)
export function parseFontFaces(css) {
	return [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{[^}]*?url\(([^)]+)\)/g)].map(
		([, subset, url]) => ({ subset, url }),
	);
}

// Descarga una fuente y la guarda en public/fonts; devuelve su tamaño en bytes
export async function downloadFont(url, fileName) {
	const data = await get(url, { text: false });
	await mkdir(FONTS_DIR, { recursive: true });
	await writeFile(path.join(FONTS_DIR, fileName), data);
	return data.length;
}

export const formatSize = (bytes) =>
	bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
