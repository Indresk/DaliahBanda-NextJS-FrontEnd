// Portada de una canción: la propia si la definió, si no la de su álbum
export function resolveSongCover(song, album) {
	return song.coverUrl
		? { url: song.coverUrl, width: song.coverWidth, height: song.coverHeight }
		: { url: album.coverUrl, width: album.coverWidth, height: album.coverHeight };
}

export const albumPath = (album) => `/albums/${album.slug}`;
export const songPath = (album, song) => `/albums/${album.slug}/${song.slug}`;

// Fecha de una canción: la suya o, si no tiene, la del álbum
export const songReleaseDate = (song, album) => song.releasedAt ?? album.releasedAt;
