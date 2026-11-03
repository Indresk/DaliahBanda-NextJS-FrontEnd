import { albumPath, songPath } from '@/shared/utils/music';
import { toPlayerTrack } from '@/frontend/utils/playerTrack';

// Obras relacionadas ({ albums, songs } de getRelatedWorks) como items de YmalItem
export function toRelatedItems({ albums, songs }) {
	return [
		...albums.map((album) => ({ kind: 'album', key: `a-${album.id}`, title: album.title, href: albumPath(album) })),
		...songs.map((song) => ({
			kind: 'song',
			key: `s-${song.id}`,
			title: song.title,
			href: songPath(song.album, song),
			track: song.audioUrl ? toPlayerTrack(song, song.album) : null,
		})),
	];
}
