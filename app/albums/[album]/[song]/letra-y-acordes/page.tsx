import Link from 'next/link';
import Button from '@/frontend/components/buttons/GeneralButton';

import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { songLyricsMeta } from '@/frontend/seo/pages/albums.meta';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ album: string; song: string }>;
}) {
	const { album, song } = await params;
	return buildMetadata(songLyricsMeta(album, song));
}


export default function LetraYAcordes() {
	return (
		<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			<h1>Albums Letra y acordes Daliah Banda</h1>
		</div>
	);
}
