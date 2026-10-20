import { getAlbum } from '@/back/services/music.cache';
import Breadcrumb from '@/frontend/components/ui/Breadcrumb';
import { albumsCrumbs } from '../../_lib/breadcrumbs';

export default async function AlbumBreadcrumb({ params }) {
	const { album: slug } = await params;
	const album = await getAlbum(slug);
	if (!album) return null;

	return <Breadcrumb items={albumsCrumbs(album)} />;
}
