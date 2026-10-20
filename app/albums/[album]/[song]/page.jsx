import { notFound } from 'next/navigation';
import PlayButton from '../../../_components/global/AudioPlayer/PlayButton';
import { getAlbum, getRelatedWorks, getSong } from '@/back/services/music.cache';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { songMeta } from '@/frontend/seo/pages/albums.meta';
import { toPlayerQueue, toPlayerTrack } from '@/frontend/utils/playerTrack';
import JsonLd from '@/frontend/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/frontend/seo/schema/breadcrumb';
import { buildMusicRecordingSchema } from '@/frontend/seo/schema/music';
import { albumsCrumbs } from '../../_lib/breadcrumbs';
import BackLink from '../../_components/BackLink';
import RelatedWorks from '../../_components/RelatedWorks';
import SongResources from '../../_components/SongResources';
import StreamingLinks from '../../_components/StreamingLinks';

export async function generateMetadata({ params }) {
	const { album, song: songSlug } = await params;
	const song = await getSong(album, songSlug);

	return song ? buildMetadata(songMeta(song.album, song)) : {};
}

const Section = ({ title, children }) => (
	<section className='flex flex-col gap-2'>
		<h2 className='font-bold'>{title}</h2>
		{children}
	</section>
);

export default async function SongPage({ params }) {
	const { album: albumSlug, song: songSlug } = await params;
	// El álbum ya está en caché por el layout; da la cola de reproducción
	const [song, album] = await Promise.all([getSong(albumSlug, songSlug), getAlbum(albumSlug)]);
	if (!song || !album) notFound();

	const related = await getRelatedWorks(song.album.id, song.id);
	// Si la canción no tiene enlaces propios se ofrecen los de su álbum
	const links = song.links.length ? song.links : album.links;

	return (
		<article className='flex flex-col gap-8'>
			<JsonLd data={buildMusicRecordingSchema(song, links)} />
			<JsonLd data={buildBreadcrumbSchema(albumsCrumbs(song.album, song))} />
			<header className='flex flex-col gap-4'>
				<div className='flex items-start justify-between gap-4'>
					<h1 className='font-headline text-4xl font-semibold tracking-tight md:text-5xl'>
						#{song.trackNumber} {song.title}
					</h1>
					<BackLink href={`/albums/${albumSlug}`} />
				</div>
				<div className='flex items-start gap-4'>
					{song.audioUrl && (
						<div className='w-16 shrink-0 md:w-20'>
							<PlayButton
								track={toPlayerTrack(song, song.album)}
								queue={toPlayerQueue(album.songs, song.album)}
							/>
						</div>
					)}
					<div className='flex flex-col gap-4'>
						<p className='text-lg'>{song.longDescription || song.shortDescription}</p>
						<StreamingLinks links={links} />
					</div>
				</div>
				<hr className='border-lightgray' />
			</header>

			<div className='flex flex-col gap-8 bg-darkgray p-6'>
				<SongResources album={song.album} song={song} resources={song.resources} />
				{song.themes.length > 0 && (
					<Section title='Temas que trata la canción'>
						<ul className='list-inside list-disc text-sm'>
							{song.themes.map((theme) => (
								<li key={theme}>{theme}</li>
							))}
						</ul>
					</Section>
				)}
				{song.story && (
					<Section title='Historia'>
						<p className='whitespace-pre-line text-sm'>{song.story}</p>
					</Section>
				)}
				{song.acknowledgments && (
					<Section title='Agradecimientos'>
						<p className='whitespace-pre-line text-sm'>{song.acknowledgments}</p>
					</Section>
				)}
			</div>

			<RelatedWorks related={related} />
		</article>
	);
}
