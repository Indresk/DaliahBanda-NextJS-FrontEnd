import { notFound } from 'next/navigation';
import { getAlbum } from '@/back/services/music.cache';
import AlbumSidebar from '../_components/AlbumSidebar';

export default async function AlbumLayout({ children, params }) {
	const { album: slug } = await params;
	const album = await getAlbum(slug);
	if (!album) notFound();

	return (
		<div className='flex flex-col md:flex-row w-full'>
			<AlbumSidebar album={album} />
			<div className='basis-full md:basis-2/3 p-6 grow'>{children}</div>
		</div>
	);
}
