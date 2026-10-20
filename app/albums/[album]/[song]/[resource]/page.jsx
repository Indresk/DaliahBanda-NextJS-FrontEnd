import { notFound } from 'next/navigation';
import { getSong } from '@/back/services/music.cache';
import { SONG_RESOURCE_ROUTES } from '@/shared/constants';
import { songPath } from '@/shared/utils/music';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { songResourceMeta } from '@/frontend/seo/pages/albums.meta';
import BackLink from '../../../_components/BackLink';

const SongResourcePage = async ({ params }) => {
	const { album: albumSlug, song: songSlug, resource: route } = await params;
	const config = SONG_RESOURCE_ROUTES[route];
	const song = config && (await getSong(albumSlug, songSlug));
	if (!song) notFound();

	const resources = song.resources.filter((resource) => resource.kind === config.kind);
	if (!resources.length) notFound();

	// Los stems se agrupan por instrumento; el resto va en una sola lista
	const groups = new Map();
	for (const resource of resources) {
		const key = resource.instrument ?? '';
		groups.set(key, [...(groups.get(key) ?? []), resource]);
	}

	return (
		<section className='flex flex-col gap-6'>
			<div className='flex items-start justify-between gap-4 border-b border-white pb-2'>
				<h1 className='text-2xl font-semibold md:text-3xl'>
					{config.label} de {song.title}
				</h1>
				<BackLink href={songPath(song.album, song)} />
			</div>
			<div className='flex flex-col gap-6 bg-darkgray p-6'>
				{[...groups].map(([instrument, items]) => (
					<div key={instrument} className='flex flex-col gap-2'>
						{instrument && <h2 className='font-bold'>{instrument}</h2>}
						<ul className='flex flex-col gap-1 text-sm'>
							{items.map((item) => (
								<li key={item.url}>
									<a href={item.url} target='_blank' rel='noopener noreferrer' className='underline hover:text-primary-light'>
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
};

export async function generateMetadata({ params }) {
	const { album, song: songSlug, resource: route } = await params;
	const config = SONG_RESOURCE_ROUTES[route];
	const song = config && (await getSong(album, songSlug));

	return song ? buildMetadata(songResourceMeta(song.album, song, route, config.label)) : {};
}

export default SongResourcePage;
