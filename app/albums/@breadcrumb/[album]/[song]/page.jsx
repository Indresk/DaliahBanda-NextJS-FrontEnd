import { getSong } from '@/back/services/music.cache';
import Breadcrumb from '@/frontend/components/ui/Breadcrumb';
import { albumsCrumbs } from '../../../_lib/breadcrumbs';

export default async function SongBreadcrumb({ params }) {
	const { album: albumSlug, song: songSlug } = await params;
	const song = await getSong(albumSlug, songSlug);
	if (!song) return null;

	return <Breadcrumb items={albumsCrumbs(song.album, song)} />;
}
