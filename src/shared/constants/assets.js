// Tipos de archivo que se pueden subir al bucket de assets y su extensión canónica
export const ASSET_TYPES = Object.freeze({
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
	'video/mp4': '.mp4',
	'application/pdf': '.pdf',
});

export const ASSET_MAX_SIZE_BYTES = 50 * 1024 * 1024;
export const ASSET_MAX_FILES_PER_BATCH = 5;

export const ASSET_UPLOAD = Object.freeze({
	// La URL firmada de R2 sirve solo este tiempo (y es reutilizable hasta entonces)
	URL_EXPIRES_SECONDS: 300,
	// Tiempo máximo entre pedir la URL y confirmar la subida (subidas grandes y lentas)
	CONFIRM_MAX_AGE_MS: 30 * 60 * 1000,
	// Los archivos no se sobrescriben (logo-v1.svg, logo-v2.svg): pueden cachearse para siempre
	CACHE_CONTROL: 'public, max-age=31536000, immutable',
	// Bytes iniciales que se leen de R2 para comprobar la firma del archivo
	SIGNATURE_BYTES: 32,
});
