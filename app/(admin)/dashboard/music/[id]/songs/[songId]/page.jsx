import { notFound } from 'next/navigation';
import { requirePageRole } from '@/back/utils/sessionGuard';
import SongsService from '@/back/services/songs.service';
import {
	createSongLink,
	deleteSong,
	deleteSongLink,
	updateSongLink,
} from '@/back/actions/songs.actions';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import DeleteEntityButton from '@/frontend/components/ui/DeleteEntityButton';
import PlatformLinksManager from '../../../_components/PlatformLinksManager';
import SongForm from '../../../_components/SongForm';
import SongResourcesManager from '../../../_components/SongResourcesManager';

export const metadata = { title: 'Editar canción' };

const LINK_ACTIONS = { create: createSongLink, update: updateSongLink, remove: deleteSongLink };

export default async function EditSongPage({ params }) {
	await requirePageRole([USER_ROLES.ADMIN]);
	const { id, songId: rawSongId } = await params;

	const albumId = Number(id);
	const songId = Number(rawSongId);
	if (![albumId, songId].every((value) => Number.isInteger(value) && value > 0)) notFound();

	const song = await SongsService.findByIdWithRelations(songId);
	// La canción debe pertenecer al álbum de la URL
	if (!song || song.albumId !== albumId) notFound();

	// Las fechas de la fila, el álbum y las relaciones no se envían al formulario principal
	const { links, resources, album, createdAt, updatedAt, ...editable } = song;

	return (
		<div className='flex flex-col gap-6'>
			<Card title={`${song.title} · ${album.title}`}>
				<SongForm albumId={albumId} song={editable} />
				<DeleteEntityButton
					id={song.id}
					action={deleteSong}
					label='Eliminar canción'
					confirmMessage={`¿Eliminar "${song.title}" con sus enlaces y recursos?`}
					redirectTo={`/dashboard/music/${albumId}`}
				/>
			</Card>
			<Card title={`Enlaces de escucha (${links.length})`}>
				<PlatformLinksManager parentKey='songId' parentId={song.id} links={links} actions={LINK_ACTIONS} />
			</Card>
			<Card title={`Recursos (${resources.length})`}>
				<SongResourcesManager songId={song.id} resources={resources} />
			</Card>
		</div>
	);
}
