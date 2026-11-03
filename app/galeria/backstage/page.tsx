import { getGalleryPage } from '@/back/services/gallery.cache';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { galleryBackstageMeta } from '@/frontend/seo/pages/gallery.meta';
import GalleryGrid from '../_components/GalleryGrid';

export const metadata = buildMetadata(galleryBackstageMeta);

export default async function BackstagePhotos() {
	const filters = { category: 'backstage' };
	const { items, nextCursor } = await getGalleryPage(filters);

	return (
		<main>
			<h2 className='px-8 pb-6 text-2xl uppercase md:px-14'>Backstage</h2>
			<GalleryGrid initialItems={items} initialCursor={nextCursor} filters={filters} />
		</main>
	);
}
