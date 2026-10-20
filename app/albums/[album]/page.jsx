import { notFound } from 'next/navigation';
import { getAlbum, getRelatedWorks } from '@/back/services/music.cache';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { albumMeta } from '@/frontend/seo/pages/albums.meta';
import JsonLd from '@/frontend/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/frontend/seo/schema/breadcrumb';
import { buildMusicAlbumSchema } from '@/frontend/seo/schema/music';
import { albumsCrumbs } from '../_lib/breadcrumbs';
import BackLink from '../_components/BackLink';
import RelatedWorks from '../_components/RelatedWorks';
import StreamingLinks from '../_components/StreamingLinks';
import TrackList from '../_components/TrackList';

export async function generateMetadata({ params }) {
	const { album: slug } = await params;
	const album = await getAlbum(slug);

	return album ? buildMetadata(albumMeta(album)) : {};
}

export default async function AlbumPage({ params }) {
	const { album: slug } = await params;
	const album = await getAlbum(slug);
	if (!album) notFound();

	// El álbum no tiene id de canción: se excluye solo el álbum de las sugerencias
	const related = await getRelatedWorks(album.id, 0);

	return (
		<section className='albumContainer flex flex-col gap-8'>
			<JsonLd data={buildMusicAlbumSchema(album)} />
			<JsonLd data={buildBreadcrumbSchema(albumsCrumbs(album))} />
			<div className='albumSongs flex flex-col gap-4'>
				<div className='flex items-start justify-between gap-4 border-b border-white pb-2'>
					<h1 className='text-2xl font-semibold md:text-3xl'>
						Escucha el álbum aquí y donde prefieras
					</h1>
					<BackLink href='/albums' />
				</div>
				<StreamingLinks links={album.links} />
			</div>
			{album.songs.length > 0 ? (
				<TrackList album={album} />
			) : (
				<p className='text-lightgray'>Pronto habrá canciones disponibles.</p>
			)}
			<RelatedWorks related={related} />
		</section>
	);
}
