import Link from 'next/link';
import Button from '@/frontend/components/buttons/GeneralButton';

import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { songScoresMeta } from '@/frontend/seo/pages/albums.meta';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ album: string; song: string }>;
}) {
	const { album, song } = await params;
	return buildMetadata(songScoresMeta(album, song));
}


export default function Partituras() {
	return (
		<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			<h1>Albums Partituras Daliah Banda</h1>
		</div>
	);
}
