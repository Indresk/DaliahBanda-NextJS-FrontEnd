import 'server-only';

// El tipo declarado por el navegador no es de fiar: se identifica por los primeros bytes
// del archivo ("números mágicos"). Devuelve el tipo MIME o null si no se reconoce.
export function detectMimeType(bytes) {
	const startsWith = (...values) =>
		values.every((value, index) => bytes[index] === value);
	const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));

	if (startsWith(0xff, 0xd8, 0xff)) return 'image/jpeg';
	if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return 'image/png';
	if (ascii(0, 6) === 'GIF87a' || ascii(0, 6) === 'GIF89a') return 'image/gif';
	if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
	if (ascii(0, 5) === '%PDF-') return 'application/pdf';
	if (ascii(4, 8) === 'ftyp') return 'video/mp4';
	return null;
}
