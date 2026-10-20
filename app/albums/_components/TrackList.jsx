import Link from 'next/link';
import PlayButton from '../../_components/global/AudioPlayer/PlayButton';
import SongOptions from '@/frontend/components/buttons/SongOptions';
import { SONG_RESOURCE_KINDS, SONG_RESOURCE_ROUTES } from '@/shared/constants';
import { formatDateOnly } from '@/shared/utils/format';
import { songPath, songReleaseDate } from '@/shared/utils/music';
import { toPlayerQueue, toPlayerTrack } from '@/frontend/utils/playerTrack';

// Variante de SongOptions de cada tipo de recurso (solo los que la canción tiene)
const RESOURCE_VARIANTS = {
	[SONG_RESOURCE_KINDS.STEM]: 'stems',
	[SONG_RESOURCE_KINDS.SCORE]: 'score',
	[SONG_RESOURCE_KINDS.LYRICS]: 'lyrics',
};

// Pistas de un álbum: número, fecha, título, descripción corta y accesos
export default function TrackList({ album }) {
	const queue = toPlayerQueue(album.songs, album);
	const routes = Object.entries(SONG_RESOURCE_ROUTES);

	return (
		<ol className='bg-darkgray px-6 py-2'>
			{album.songs.map((song) => {
				const resources = routes.filter(([, route]) => song.resourceKinds.includes(route.kind));

				return (
					<li key={song.id} className='flex gap-4 border-b border-black py-5 last:border-b-0'>
						<span className='w-16 shrink-0 font-headline text-5xl text-primary-light'>#{song.trackNumber}</span>
						<div className='flex min-w-0 flex-col gap-2'>
							<div>
								<small className='text-xs'>{formatDateOnly(songReleaseDate(song, album))}</small>
								<h3 className='font-headline text-2xl font-semibold tracking-tight'>
									<Link href={songPath(album, song)} className='hover:underline'>{song.title}</Link>
								</h3>
								<p className='text-xs'>{song.shortDescription}</p>
							</div>
							<div className='flex flex-wrap gap-y-2'>
								{song.audioUrl && (
									<PlayButton track={toPlayerTrack(song, album)} queue={queue}>
										<SongOptions variant='play' lastChild={!resources.length} />
									</PlayButton>
								)}
								{resources.map(([route, { kind }], index) => (
									<Link key={route} href={`${songPath(album, song)}/${route}`}>
										<SongOptions variant={RESOURCE_VARIANTS[kind]} lastChild={index === resources.length - 1} />
									</Link>
								))}
							</div>
						</div>
					</li>
				);
			})}
		</ol>
	);
}
