import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { aboutMeta } from '@/frontend/seo/pages/about.meta';

export const metadata = buildMetadata(aboutMeta);

export default function AboutUs() {
	return (
		<>
			<h1>About us view</h1>
		</>
	);
}
