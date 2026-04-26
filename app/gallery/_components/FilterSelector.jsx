'use client';
import Button from '@/components/buttons/GeneralButton';
import NavLink from '@/components/util/NavLink';

export default function FilterSelector() {
	const filters = [
		{ name: 'todos', link: '/gallery' },
		{ name: 'Silvia', link: '/gallery/silvia' },
		{ name: 'Mike', link: '/gallery/mike' },
		{ name: 'Rafa', link: '/gallery/rafa' },
		{ name: 'Aya', link: '/gallery/aya' },
		{ name: 'Chris', link: '/gallery/chris' },
		{ name: 'Nico', link: '/gallery/nico' },
	];
	// Pendiente ajustar dropdown en mobile
	return (
		<>
			<div>Filtros:</div>

			{filters.map((filter) => (
				<NavLink key={filter.name} href={filter.link}>
					{({ isActive }) => (
						<Button variant={isActive ? 'primary' : 'secondary'} className=''>
							{filter.name}
						</Button>
					)}
				</NavLink>
			))}
		</>
	);
}
