'use client';

import NavLink from '@/frontend/components/util/NavLink';

const TABS = [
	{ href: '/dashboard/gallery', label: 'Imágenes', exact: true },
	{ href: '/dashboard/gallery/new', label: 'Añadir imagen' },
	{ href: '/dashboard/gallery/upload', label: 'Subir en lote' },
	{ href: '/dashboard/gallery/events', label: 'Eventos' },
	{ href: '/dashboard/gallery/people', label: 'Integrantes' },
];

export default function GalleryTabs() {
	return (
		<nav aria-label='Galería' className='mb-8 flex flex-wrap gap-2 border-b border-darkgray pb-3'>
			{TABS.map((tab) => (
				<NavLink
					key={tab.href}
					href={tab.href}
					exact
					className='px-3 py-1 font-headline text-sm uppercase tracking-tight text-lightgray transition-colors hover:text-white'
					activeClassName='bg-primary !text-white'>
					{tab.label}
				</NavLink>
			))}
		</nav>
	);
}
