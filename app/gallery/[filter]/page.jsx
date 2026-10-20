import { notFound } from 'next/navigation';
import { getGalleryPage, getGalleryPerson } from '@/back/services/gallery.cache';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import {
	galleryFallbackMeta,
	galleryFilterMeta,
} from '@/frontend/seo/pages/gallery.meta';
import GalleryGrid from '../_components/GalleryGrid';

export async function generateMetadata({ params }) {
	const { filter } = await params;
	const person = await getGalleryPerson(filter);

	return buildMetadata(person ? galleryFilterMeta(person) : galleryFallbackMeta(filter));
}

// Fotos en las que aparece un integrante (/gallery/<slug>)
export default async function GalleryByPerson({ params }) {
	const { filter } = await params;
	const person = await getGalleryPerson(filter);
	if (!person) notFound();

	const filters = { memberSlugs: [person.slug] };
	const { items, nextCursor } = await getGalleryPage(filters);

	return (
		<main>
			<h2 className='px-8 pb-6 text-2xl uppercase md:px-14'>Fotos de {person.name}</h2>
			<GalleryGrid initialItems={items} initialCursor={nextCursor} filters={filters} />
		</main>
	);
}
