import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { membersMeta } from '@/frontend/seo/pages/about.meta';

export const metadata = buildMetadata(membersMeta);

export default function Members() {
	return (
		<>
			<h1>Members view</h1>
		</>
	);
}
