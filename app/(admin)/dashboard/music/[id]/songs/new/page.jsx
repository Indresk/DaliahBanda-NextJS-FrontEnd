import { notFound } from 'next/navigation';
import { requirePageRole } from '@/back/utils/sessionGuard';
import AlbumsService from '@/back/services/albums.service';
import SongsService from '@/back/services/songs.service';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import SongForm from '../../../_components/SongForm';

export const metadata = { title: 'Nueva canción' };

export default async function NewSongPage({ params }) {
	await requirePageRole([USER_ROLES.ADMIN]);
	const { id } = await params;

	const albumId = Number(id);
	if (!Number.isInteger(albumId) || albumId <= 0) notFound();

	const [album, songs] = await Promise.all([
		AlbumsService.findByIdWithLinks(albumId),
		SongsService.findByAlbum(albumId),
	]);
	if (!album) notFound();

	return (
		<Card title={`Nueva canción de "${album.title}"`}>
			<SongForm albumId={album.id} nextTrackNumber={songs.length + 1} />
		</Card>
	);
}
