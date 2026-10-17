import Image from 'next/image';

export default function TrackInfo({ track }) {
	return (
		<div className='flex min-w-0 items-center gap-3'>
			{track.cover ? (
				<Image
					unoptimized
					width={48}
					height={48}
					src={track.cover}
					alt={`Portada de ${track.title}`}
					className='size-12 shrink-0 object-cover'
				/>
			) : (
				<div className='size-12 shrink-0 bg-primary' aria-hidden='true' />
			)}
			<div className='min-w-0'>
				<p className='truncate font-headline text-sm font-bold uppercase tracking-tighter'>
					{track.title}
				</p>
				<p className='truncate text-xs text-lightgray'>{track.artist}</p>
			</div>
		</div>
	);
}
