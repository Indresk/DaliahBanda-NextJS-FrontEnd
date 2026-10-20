'use client';

import NavLink from '@/frontend/components/util/NavLink';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';

export default function DashboardNav({ sections }) {
	return (
		<nav aria-label='Secciones del dashboard'>
			<ul className='flex flex-wrap gap-1 md:flex-col'>
				{sections.map((section) => (
					<li key={section.href}>
						<NavLink
							href={section.href}
							className='flex items-center gap-3 px-3 py-2 font-headline text-sm uppercase tracking-tight text-lightgray transition-colors hover:text-white'
							activeClassName='bg-darkgray !text-white'>
							<MSOIcon className='text-xl'>{section.icon}</MSOIcon>
							{section.label}
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	);
}
