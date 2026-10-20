import Image from 'next/image';
import Link from 'next/link';
import { requirePageRole } from '@/back/utils/sessionGuard';
import AlbumsService from '@/back/services/albums.service';
import { ALBUM_TYPE_LABELS, USER_ROLES } from '@/shared/constants';
import { formatDateOnly } from '@/shared/utils/format';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import PageTitle from '@/frontend/components/ui/PageTitle';

export const metadata = { title: 'Música' };

export default async function MusicPage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const albums = await AlbumsService.findAll();

	return (
		<>
			<PageTitle
				title='Música'
				description='Álbumes y sencillos con sus canciones, enlaces de escucha y recursos (stems, partituras, letras). Un sencillo es un álbum de una sola canción.'
			/>
			<Card
				title={`Álbumes y sencillos (${albums.length})`}
				action={
					<span className='flex gap-4 font-headline text-sm uppercase'>
						<a href='/dashboard/music/export' download className='underline'>Exportar JSON (para seed)</a>
						<Link href='/dashboard/music/new' className='underline'>Nuevo</Link>
					</span>
				}>
				<ul>
					{albums.map((album) => (
						<li key={album.id} className='flex flex-wrap items-center gap-3 border-t border-black py-3'>
							<div className='relative size-14 shrink-0 bg-black'>
								<Image src={album.coverUrl} alt='' fill unoptimized sizes='56px' className='object-cover' />
							</div>
							<strong>{album.title}</strong>
							<Badge tone='neutral'>{ALBUM_TYPE_LABELS[album.type]}</Badge>
							<Badge tone={album.active ? 'ok' : 'warn'}>{album.active ? 'Publicado' : 'Oculto'}</Badge>
							<span className='text-xs text-lightgray'>
								/{album.slug} · {album.songCount} canciones · {formatDateOnly(album.releasedAt)}
							</span>
							<Link href={`/dashboard/music/${album.id}`} className='ml-auto text-xs underline'>Editar</Link>
						</li>
					))}
				</ul>
			</Card>
		</>
	);
}
