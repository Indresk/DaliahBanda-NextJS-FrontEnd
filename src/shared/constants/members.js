export const MEMBER_LINK_KINDS = Object.freeze({
	CONTACT: 'contact',
	PROJECT: 'project',
});

export const MEMBERS = Object.freeze({
	// Etiqueta de la caché de Next de las lecturas públicas (ver members.cache.js)
	CACHE_TAG: 'members',
	CACHE_FALLBACK_SECONDS: 900,
	MAX_LINKS: 20,
	MAX_IMAGES: 20,
});

export const FLYERS = Object.freeze({
	// Etiqueta de la caché de Next de las lecturas públicas (ver flyers.cache.js)
	CACHE_TAG: 'flyers',
	CACHE_FALLBACK_SECONDS: 900,
});
