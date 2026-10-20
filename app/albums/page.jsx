import Link from 'next/link';
import Button from '@/frontend/components/buttons/GeneralButton';

import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { albumsMeta } from '@/frontend/seo/pages/albums.meta';

export const metadata = buildMetadata(albumsMeta);


export default function AlbumsIndex() {
	return (
		<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			<h1>Albums Daliah Banda</h1>

			<Link href='/albums/prueba'>
				<Button>Prueba de BreadCrumb</Button>
			</Link>
			<Link href='/albums/test'>
				<Button>Prueba 2 de BreadCrumb</Button>
			</Link>
		</div>
	);
}
