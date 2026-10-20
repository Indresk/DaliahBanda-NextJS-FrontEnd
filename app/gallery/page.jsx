import Link from 'next/link';
import Image from 'next/image';
import { getGalleryEvents } from '@/back/services/gallery.cache';
import { isOptimizedImageUrl } from '@/shared/utils/images';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { galleryMeta } from '@/frontend/seo/pages/gallery.meta';

export const metadata = buildMetadata(galleryMeta);

// Los eventos destacados llegan primero (ver GalleryEventsRepository.listWithStats)
export default async function GalleryIndex() {
	const events = await getGalleryEvents();
	const highlights = events.slice(0, 3);
	const rows = events.slice(3);

	if (events.length === 0) {
		return <p className='px-8 pb-14 md:px-14'>Todavía no hay eventos en la galería.</p>;
	}

	return (
		<section className='flex flex-col px-8 pb-14 md:px-14 gap-4'>
			<div className='grid md:grid-cols-5 gap-4'>
				{highlights[0] && (
					<EventCard
						event={highlights[0]}
						className='md:col-span-3 h-40 md:h-160'
						sizes='(max-width: 640px) 100vw, 60vw'
						eager
					/>
				)}
				<div className='flex flex-col gap-4 h-80 md:h-160 md:col-span-2'>
					{highlights.slice(1).map((event) => (
						<EventCard
							key={event.id}
							event={event}
							className='basis-[50%]'
							sizes='(max-width: 640px) 100vw, 40vw'
						/>
					))}
				</div>
			</div>
			{rows.length > 0 && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{rows.map((event) => (
						<EventCard
							key={event.id}
							event={event}
							className='h-40 md:h-80'
							sizes='(max-width: 640px) 100vw,(max-width: 768px) 50vw, 33vw'
						/>
					))}
				</div>
			)}
		</section>
	);
}

function EventCard({ event, className, sizes, eager = false }) {
	return (
		<Link href={`/gallery/events/${event.slug}`} className={className}>
			<div className='grid h-full overflow-hidden w-full relative'>
				<Image
					src={event.cover.url}
					alt={event.cover.alt}
					unoptimized={!isOptimizedImageUrl(event.cover.url)}
					loading={eager ? 'eager' : 'lazy'}
					fill
					sizes={sizes}
					className='object-cover'
				/>
				<div className='[grid-area:1/1] z-1 flex flex-col justify-end'>
					<h3 className='uppercase font-bold p-2 bg-darkgray'>{event.title}</h3>
				</div>
			</div>
		</Link>
	);
}
