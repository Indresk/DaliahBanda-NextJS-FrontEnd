import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { comunityMeta } from '@/frontend/seo/pages/about.meta';

export const metadata = buildMetadata(comunityMeta);

export default function Comunity() {
	return (
		<>
			<h1>comunity view</h1>
		</>
	);
}
