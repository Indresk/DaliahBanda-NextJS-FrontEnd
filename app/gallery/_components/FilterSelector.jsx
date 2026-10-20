'use client';
import Button from '@/frontend/components/buttons/GeneralButton';
import NavLink from '@/frontend/components/util/NavLink';

// `members`: integrantes actuales con fotos ({ slug, name }), vienen de la base de datos
export default function FilterSelector({ members = [] }) {
	const filters = [
		{ name: 'todos', link: '/gallery' },
		...members.map((member) => ({ name: member.name, link: `/gallery/${member.slug}` })),
		{ name: 'backstage', link: '/gallery/backstage' },
	];

	return (
		<>
			<div>Filtros:</div>

			{filters.map((filter) => (
				<NavLink key={filter.link} href={filter.link}>
					{({ isActive }) => (
						<Button variant={isActive ? 'primary' : 'secondary'}>
							{filter.name}
						</Button>
					)}
				</NavLink>
			))}
		</>
	);
}
