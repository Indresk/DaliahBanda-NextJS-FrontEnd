import { MUSIC } from '@/shared/constants';
import { resolveSongCover } from '@/shared/utils/music';

// Pista del reproductor (ver playerStore) a partir de una canción de la base de datos
export function toPlayerTrack(song, album) {
	return {
		id: `song-${song.id}`,
		title: song.title,
		artist: MUSIC.ARTIST,
		src: song.audioUrl,
		cover: resolveSongCover(song, album).url,
	};
}

// Cola con las canciones que tienen audio, en el orden recibido
export const toPlayerQueue = (songs, album) =>
	songs.filter((song) => song.audioUrl).map((song) => toPlayerTrack(song, album));
