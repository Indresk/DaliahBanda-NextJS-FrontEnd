// Un sencillo es un álbum de una sola canción: así álbumes y sencillos comparten listado y rutas
export const ALBUM_TYPES = Object.freeze({
	ALBUM: 'album',
	EP: 'ep',
	SINGLE: 'single',
});

export const ALBUM_TYPE_LABELS = Object.freeze({
	[ALBUM_TYPES.ALBUM]: 'Álbum',
	[ALBUM_TYPES.EP]: 'EP',
	[ALBUM_TYPES.SINGLE]: 'Sencillo',
});

// Plataformas donde se puede escuchar (clave → nombre)
export const STREAMING_PLATFORMS = Object.freeze({
	spotify: 'Spotify',
	apple: 'Apple Music',
	youtube: 'YouTube Music',
	amazon: 'Amazon Music',
});

export const SONG_RESOURCE_KINDS = Object.freeze({
	STEM: 'stem',
	SCORE: 'score',
	LYRICS: 'lyrics',
	VIDEO: 'video',
});

// Rutas públicas de los recursos de una canción: /albums/[album]/[song]/<ruta>
export const SONG_RESOURCE_ROUTES = Object.freeze({
	stems: { kind: SONG_RESOURCE_KINDS.STEM, label: 'Stems' },
	partituras: { kind: SONG_RESOURCE_KINDS.SCORE, label: 'Partituras' },
	'letra-y-acordes': { kind: SONG_RESOURCE_KINDS.LYRICS, label: 'Letra y acordes' },
});

export const MUSIC = Object.freeze({
	// Etiqueta de la caché de Next de las lecturas públicas (ver music.cache.js)
	CACHE_TAG: 'music',
	CACHE_FALLBACK_SECONDS: 900,
	ARTIST: 'Daliah Banda',
	MAX_THEMES: 20,
	// Cuántas obras sugiere "Otros de nuestros trabajos"
	RELATED_ALBUMS: 1,
	RELATED_SONGS: 2,
});
