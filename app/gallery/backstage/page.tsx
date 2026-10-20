import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { galleryBackstageMeta } from '@/frontend/seo/pages/gallery.meta';

export const metadata = buildMetadata(galleryBackstageMeta);

export default function BackstagePhotos() {
	return (
		<div>
			<h1>Fotos Backstage</h1>
		</div>
	);
}
