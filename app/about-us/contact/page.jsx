import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { contactMeta } from '@/frontend/seo/pages/about.meta';

export const metadata = buildMetadata(contactMeta);

export default function Contact() {
	return (
		<>
			<h1>Contact view</h1>
		</>
	);
}
