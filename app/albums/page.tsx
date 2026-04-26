import Link from 'next/link';
import Button from '@/components/buttons/GeneralButton';

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
