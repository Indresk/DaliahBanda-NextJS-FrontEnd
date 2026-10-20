export const GALLERY_CATEGORIES = Object.freeze({
	LIVE: 'live',
	BACKSTAGE: 'backstage',
});

// Cómo se combinan los integrantes al editar varias imágenes a la vez
export const GALLERY_MEMBER_MODES = Object.freeze({
	ADD: 'add',
	REMOVE: 'remove',
	SET: 'set',
});

export const GALLERY = Object.freeze({
	// Etiqueta de la caché de Next de las lecturas públicas (ver gallery.cache.js)
	CACHE_TAG: 'gallery',
	// Respaldo: caduca aunque no se invalide (segundos)
	CACHE_FALLBACK_SECONDS: 900,
	PUBLIC_PAGE_SIZE: 24,
	ADMIN_PAGE_SIZE: 40,
	MAX_PAGE_SIZE: 100,
	// Máximo de imágenes en una operación masiva o subida en lote
	MAX_BULK_ITEMS: 200,
	MAX_ALT_LENGTH: 500,
	MAX_MEMBERS_PER_IMAGE: 20,
	MAX_DIMENSION: 30000,
});
