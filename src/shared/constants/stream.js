export const STREAM = Object.freeze({
	// Etiqueta de la caché de Next que contiene el estado en vivo (ver liveStatus.cache.js)
	STATUS_TAG: 'live-status',
	// Si el webhook de fin se pierde, pasado este tiempo se deja de mostrar como "en vivo"
	MAX_LIVE_HOURS: 12,
	// Cada cuánto caduca la caché como respaldo si no llega ningún webhook (segundos)
	CACHE_FALLBACK_SECONDS: 900,
});
