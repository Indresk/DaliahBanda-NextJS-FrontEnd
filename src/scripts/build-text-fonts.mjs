// Genera las fuentes de texto del sitio en woff2, solo con el subconjunto latino (español incluido).
//   pnpm fonts:text
// Pide a Google Fonts el bloque `latin` de cada familia (variable en peso) y reemplaza el archivo en
// public/fonts. Se ejecuta en local, pocas veces (cambio de fuente o de rango de pesos). Necesita red.
import path from 'node:path';
import { FONTS_DIR, downloadFont, fetchText, formatSize, parseFontFaces } from './lib/googleFonts.mjs';

const SUBSET = 'latin';

const FONTS = [
	{ family: 'Space Grotesk', weights: '300..700', output: 'sg-variable.woff2' },
	{ family: 'Manrope', weights: '200..800', output: 'mr-variable.woff2' },
];

for (const { family, weights, output } of FONTS) {
	const css = await fetchText(
		`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weights}&display=swap`,
	);
	const face = parseFontFaces(css).find((item) => item.subset === SUBSET);
	if (!face) throw new Error(`Google no devolvió el subconjunto ${SUBSET} de ${family}.`);

	const bytes = await downloadFont(face.url, output);
	console.log(`${family} ${weights}: ${path.join(FONTS_DIR, output)} (${formatSize(bytes)})`);
}
