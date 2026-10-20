import { getSong } from '@/back/services/music.cache';
import { SONG_RESOURCE_ROUTES } from '@/shared/constants';
import Breadcrumb from '@/frontend/components/ui/Breadcrumb';
import { albumsCrumbs } from '../../../../_lib/breadcrumbs';

export default async function SongResourceBreadcrumb({ params }) {
	const { album: albumSlug, song: songSlug, resource: route } = await params;
	const config = SONG_RESOURCE_ROUTES[route];
	const song = config && (await getSong(albumSlug, songSlug));
	if (!song) return null;

	return <Breadcrumb items={albumsCrumbs(song.album, song, { route, label: config.label })} />;
}
