import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePageRole } from '@/back/utils/sessionGuard';
import AlbumsService from '@/back/services/albums.service';
import SongsService from '@/back/services/songs.service';
import {
	createAlbumLink,
	deleteAlbum,
	deleteAlbumLink,
	updateAlbumLink,
} from '@/back/actions/albums.actions';
import { USER_ROLES } from '@/shared/constants';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import DeleteEntityButton from '@/frontend/components/ui/DeleteEntityButton';
import AlbumForm from '../_components/AlbumForm';
import PlatformLinksManager from '../_components/PlatformLinksManager';

export const metadata = { title: 'Editar álbum' };

const LINK_ACTIONS = { create: createAlbumLink, update: updateAlbumLink, remove: deleteAlbumLink };

export default async function EditAlbumPage({ params }) {
	await requirePageRole([USER_ROLES.ADMIN]);
	const { id } = await params;

	const albumId = Number(id);
	if (!Number.isInteger(albumId) || albumId <= 0) notFound();

	const [album, songs] = await Promise.all([
		AlbumsService.findByIdWithLinks(albumId),
		SongsService.findByAlbum(albumId),
	]);
	if (!album) notFound();

	// Las fechas de la fila y los enlaces no se envían al formulario principal
	const { links, createdAt, updatedAt, ...editable } = album;

	return (
		<div className='flex flex-col gap-6'>
			<Card title={album.title}>
				<AlbumForm album={editable} />
				<DeleteEntityButton
					id={album.id}
					action={deleteAlbum}
					label='Eliminar álbum'
					confirmMessage={`¿Eliminar "${album.title}" y sus enlaces? Debe no tener canciones.`}
					redirectTo='/dashboard/music'
				/>
			</Card>
			<Card title={`Enlaces de escucha (${links.length})`}>
				<PlatformLinksManager parentKey='albumId' parentId={album.id} links={links} actions={LINK_ACTIONS} />
			</Card>
			<Card
				title={`Canciones (${songs.length})`}
				action={
					<Link href={`/dashboard/music/${album.id}/songs/new`} className='font-headline text-sm uppercase underline'>
						Nueva canción
					</Link>
				}>
				<ul>
					{songs.map((song) => (
						<li key={song.id} className='flex flex-wrap items-center gap-3 border-t border-black py-3'>
							<span className='text-primary-light'>#{song.trackNumber}</span>
							<strong>{song.title}</strong>
							<Badge tone={song.active ? 'ok' : 'warn'}>{song.active ? 'Publicada' : 'Oculta'}</Badge>
							{song.featured && <Badge tone='live'>Destacada</Badge>}
							{song.audioUrl && <Badge tone='neutral'>Con audio</Badge>}
							<Link href={`/dashboard/music/${album.id}/songs/${song.id}`} className='ml-auto text-xs underline'>Editar</Link>
						</li>
					))}
				</ul>
			</Card>
		</div>
	);
}
