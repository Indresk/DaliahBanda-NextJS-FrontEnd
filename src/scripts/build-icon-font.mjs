// Genera public/fonts/mso-variable.woff2 con SOLO los iconos Material Symbols que usa el código.
//   pnpm fonts:icons           detecta los iconos, pide el subconjunto a Google y reemplaza el archivo
//   pnpm fonts:icons --check   solo comprueba que el archivo cubre los iconos usados (no necesita red
//                              para el subconjunto; sale con error si falta alguno)
// Se ejecuta en local antes de desplegar cuando se añade o cambia un icono. Necesita red.
//
// Cómo detecta los iconos: en los archivos que usan <MSOIcon> o una propiedad `icon:` toma todos los
// textos con forma de nombre (minúsculas y guiones bajos) y se queda con los que son iconos reales
// (lista oficial de Google). Un texto que no es icono se ignora; si en <MSOIcon> o `icon:` aparece un
// nombre que no existe, avisa. Un icono con nombre armado dinámicamente no se detecta: escríbelo
// completo en algún sitio (como hace VolumeControl con volume_off / volume_down / volume_up).
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { FONTS_DIR, downloadFont, fetchText, formatSize, parseFontFaces } from './lib/googleFonts.mjs';

const OUTPUT = 'mso-variable.woff2';
const MANIFEST = path.resolve('src/scripts/mso-icons.json');
const SOURCE_DIRS = ['app', 'src'];
const SKIP_DIRS = new Set(['node_modules', '.next', 'scripts']);
// Ejes: relleno 0, peso 400 y gradiente 0 fijos; se conserva `opsz` (20-48) para que cada tamaño se
// vea como con la fuente completa. Si el CSS usa otros valores (font-variation-settings), cámbialos aquí.
const AXES = 'opsz,wght,FILL,GRAD@20..48,400,0,0';
const METADATA_URL = 'https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true';

async function* sourceFiles(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (!SKIP_DIRS.has(entry.name)) yield* sourceFiles(full);
		} else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
			yield full;
		}
	}
}

// { candidates: nombres con forma de icono, explicit: los que están claramente puestos como icono }
async function collectNames() {
	const candidates = new Set();
	const explicit = new Set();

	for (const dir of SOURCE_DIRS) {
		for await (const file of sourceFiles(dir)) {
			const source = await readFile(file, 'utf8');
			if (!/MSOIcon|\bicon\s*:/.test(source)) continue;

			for (const [, , name] of source.matchAll(/(['"`])([a-z][a-z0-9_]*)\1/g)) candidates.add(name);
			for (const [, name] of source.matchAll(/>\s*([a-z][a-z0-9_]*)\s*<\/MSOIcon>/g)) {
				candidates.add(name);
				explicit.add(name);
			}
			for (const [, name] of source.matchAll(/\bicon\s*:\s*['"]([a-z][a-z0-9_]*)['"]/g)) {
				candidates.add(name);
				explicit.add(name);
			}
		}
	}
	return { candidates, explicit };
}

async function officialIconNames() {
	const body = (await fetchText(METADATA_URL)).replace(/^\)\]\}'\s*/, '');
	return new Set(JSON.parse(body).icons.map((icon) => icon.name));
}

const { candidates, explicit } = await collectNames();
const official = await officialIconNames();
const icons = [...candidates].filter((name) => official.has(name)).sort();
const invalid = [...explicit].filter((name) => !official.has(name)).sort();

if (invalid.length) console.warn(`Aviso: no son iconos de Material Symbols: ${invalid.join(', ')}`);

if (process.argv.includes('--check')) {
	const saved = JSON.parse(await readFile(MANIFEST, 'utf8').catch(() => '{"icons":[]}')).icons;
	const missing = icons.filter((name) => !saved.includes(name));
	if (missing.length) {
		console.error(`Faltan en ${OUTPUT}: ${missing.join(', ')}. Ejecuta: pnpm fonts:icons`);
		process.exit(1);
	}
	console.log(`OK: ${OUTPUT} cubre los ${icons.length} iconos usados.`);
	process.exit(0);
}

// Google exige los nombres en orden alfabético
const css = await fetchText(
	`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:${AXES}&icon_names=${icons.join(',')}&display=block`,
);
const url = css.match(/url\(([^)]+)\)\s*format\('woff2'\)/)?.[1] ?? parseFontFaces(css)[0]?.url;
if (!url) throw new Error('Google no devolvió una fuente woff2.');

const bytes = await downloadFont(url, OUTPUT);
await writeFile(MANIFEST, `${JSON.stringify({ axes: AXES, icons }, null, '\t')}\n`);

console.log(`${icons.length} iconos: ${icons.join(', ')}`);
console.log(`${path.join(FONTS_DIR, OUTPUT)} (${formatSize(bytes)})`);
