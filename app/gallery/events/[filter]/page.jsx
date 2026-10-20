import { notFound } from 'next/navigation';
import { getGalleryEvent, getGalleryPage } from '@/back/services/gallery.cache';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import {
	galleryEventMeta,
	galleryFallbackMeta,
} from '@/frontend/seo/pages/gallery.meta';
import GalleryGrid from '../../_components/GalleryGrid';

export async function generateMetadata({ params }) {
	const { filter } = await params;
	const event = await getGalleryEvent(filter);

	return buildMetadata(event ? galleryEventMeta(event) : galleryFallbackMeta(filter));
}

// Fotos de un evento (/gallery/events/<slug>)
export default async function GalleryByEvent({ params }) {
	const { filter } = await params;
	const event = await getGalleryEvent(filter);
	if (!event) notFound();

	const filters = { eventId: event.id };
	const { items, nextCursor } = await getGalleryPage(filters);

	return (
		<main>
			<div className='px-8 pb-6 md:px-14'>
				<h2 className='text-2xl uppercase'>{event.title}</h2>
				{event.description && <p className='mt-2 max-w-3xl'>{event.description}</p>}
			</div>
			<GalleryGrid initialItems={items} initialCursor={nextCursor} filters={filters} />
		</main>
	);
}
