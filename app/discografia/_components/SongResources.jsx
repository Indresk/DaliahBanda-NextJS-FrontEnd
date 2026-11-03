import Link from 'next/link';
import SongOptions from '@/frontend/components/buttons/SongOptions';
import { SONG_RESOURCE_KINDS, SONG_RESOURCE_ROUTES } from '@/shared/constants';
import { songPath } from '@/shared/utils/music';

const RESOURCE_VARIANTS = {
	[SONG_RESOURCE_KINDS.STEM]: 'stems',
	[SONG_RESOURCE_KINDS.SCORE]: 'score',
	[SONG_RESOURCE_KINDS.LYRICS]: 'lyrics',
};

// Accesos a los recursos de la canción (solo los tipos que tiene) y sus videos
export default function SongResources({ album, song, resources }) {
	const available = Object.entries(SONG_RESOURCE_ROUTES).filter(([, route]) =>
		resources.some((resource) => resource.kind === route.kind),
	);
	const videos = resources.filter((resource) => resource.kind === SONG_RESOURCE_KINDS.VIDEO);
	if (!available.length && !videos.length) return null;

	return (
		<div className='flex flex-col gap-4'>
			{available.length > 0 && (
				<nav aria-label='Recursos de la canción' className='flex flex-wrap gap-y-2'>
					{available.map(([route, { kind }], index) => (
						<Link key={route} href={`${songPath(album, song)}/${route}`}>
							<SongOptions variant={RESOURCE_VARIANTS[kind]} lastChild={index === available.length - 1} />
						</Link>
					))}
				</nav>
			)}
			{videos.length > 0 && (
				<ul className='flex flex-col gap-1 text-sm'>
					{videos.map((video) => (
						<li key={video.url}>
							<a href={video.url} target='_blank' rel='noopener noreferrer' className='underline hover:text-primary-light'>
								{video.label}
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
