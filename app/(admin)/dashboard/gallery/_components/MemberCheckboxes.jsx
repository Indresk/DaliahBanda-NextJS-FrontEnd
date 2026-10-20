// Casillas de integrantes (name="memberSlugs" por defecto). Sin estado: sirve en formularios
// de servidor y de cliente. Los integrantes actuales van primero.
export default function MemberCheckboxes({ people, selected = [], name = 'memberSlugs' }) {
	return (
		<fieldset className='flex flex-wrap gap-x-4 gap-y-2'>
			<legend className='sr-only'>Integrantes</legend>
			{people.map((person) => (
				<label key={person.slug} className='flex cursor-pointer items-center gap-2 text-sm'>
					<input
						type='checkbox'
						name={name}
						value={person.slug}
						defaultChecked={selected.includes(person.slug)}
					/>
					<span className={person.isMember ? '' : 'text-lightgray'}>{person.name}</span>
				</label>
			))}
		</fieldset>
	);
}
