import { getAlbums } from '@/back/services/music.cache';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { albumsMeta } from '@/frontend/seo/pages/albums.meta';
import AlbumCard from './_components/AlbumCard';

export const metadata = buildMetadata(albumsMeta);

export default async function AlbumsIndex() {
	const albums = await getAlbums();

	return (
		<div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
			<h1 className='mb-8 font-headline text-4xl font-bold uppercase tracking-tighter md:text-6xl'>
				Discografía
			</h1>
			{albums.length > 0 ? (
				<ul className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4'>
					{albums.map((album) => (
						<li key={album.id}>
							<AlbumCard album={album} />
						</li>
					))}
				</ul>
			) : (
				<p className='text-lightgray'>Pronto habrá música disponible.</p>
			)}
		</div>
	);
}
