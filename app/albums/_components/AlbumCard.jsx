import Image from 'next/image';
import Link from 'next/link';
import { ALBUM_TYPE_LABELS } from '@/shared/constants';
import { albumPath } from '@/shared/utils/music';

// Tarjeta del listado de álbumes y sencillos
export default function AlbumCard({ album }) {
	return (
		<Link href={albumPath(album)} className='group flex flex-col gap-3'>
			<Image
				width={album.coverWidth}
				height={album.coverHeight}
				sizes='(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'
				src={album.coverUrl}
				alt={`Portada de ${album.title}.`}
				className='aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]'
			/>
			<div>
				<small className='font-headline text-[12px] uppercase tracking-tighter text-primary-light'>
					{ALBUM_TYPE_LABELS[album.type]} · {album.releasedAt.slice(0, 4)}
				</small>
				<h3 className='font-headline text-xl font-bold uppercase tracking-tighter group-hover:underline'>
					{album.title}
				</h3>
				{album.tagline && <p className='text-sm text-lightgray'>{album.tagline}</p>}
			</div>
		</Link>
	);
}
