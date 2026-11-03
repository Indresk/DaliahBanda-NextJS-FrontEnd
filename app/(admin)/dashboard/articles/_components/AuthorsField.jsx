'use client';

import { useState } from 'react';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';
import { AUTHOR_KINDS } from '@/shared/constants';

const TYPES = [
	{ value: 'member', label: 'Miembro de la banda' },
	{ value: AUTHOR_KINDS.PERSON, label: 'Persona (texto)' },
	{ value: AUTHOR_KINDS.ORGANIZATION, label: 'Organización (texto)' },
];

// De un autor guardado al estado del formulario y de vuelta al JSON que se envía
const toRow = (author) => ({
	type: author.memberId ? 'member' : author.kind,
	memberId: author.memberId ?? '',
	name: author.memberId ? '' : author.name,
});
const toPayload = (row) =>
	row.type === 'member'
		? { memberId: Number(row.memberId) || null }
		: { name: row.name, kind: row.type };

// Autores del artículo: miembros (enlazan a su página) o textos (personas u organizaciones). Sin autores
// el artículo se muestra como anónimo. Se envían como JSON en un campo oculto (las filas vacías se ignoran).
export default function AuthorsField({ defaultValue = [], members }) {
	const [rows, setRows] = useState(() => defaultValue.map(toRow));

	const update = (index, changes) =>
		setRows((current) => current.map((row, i) => (i === index ? { ...row, ...changes } : row)));
	const remove = (index) => setRows((current) => current.filter((_, i) => i !== index));
	const move = (index, step) =>
		setRows((current) => {
			const target = index + step;
			if (target < 0 || target >= current.length) return current;
			const next = [...current];
			[next[index], next[target]] = [next[target], next[index]];
			return next;
		});

	return (
		<Field label='Autores' hint='Sin autores, el artículo se muestra como anónimo. El orden es el que se muestra.'>
			<input type='hidden' name='authors' value={JSON.stringify(rows.map(toPayload).filter((author) => author.memberId || author.name))} />
			<ul className='flex flex-col gap-2'>
				{rows.map((row, index) => (
					<li key={index} className='flex flex-wrap items-center gap-2 bg-black p-2'>
						<select
							aria-label={`Tipo del autor ${index + 1}`}
							value={row.type}
							onChange={(e) => update(index, { type: e.target.value })}
							className={`${controlClass} sm:w-52`}>
							{TYPES.map((type) => (
								<option key={type.value} value={type.value}>{type.label}</option>
							))}
						</select>
						{row.type === 'member' ? (
							<select
								aria-label={`Miembro del autor ${index + 1}`}
								value={row.memberId}
								onChange={(e) => update(index, { memberId: e.target.value })}
								className={`${controlClass} min-w-48 flex-1`}>
								<option value='' disabled>Elegir miembro…</option>
								{members.map((member) => (
									<option key={member.id} value={member.id}>{member.name}</option>
								))}
							</select>
						) : (
							<input
								aria-label={`Nombre del autor ${index + 1}`}
								value={row.name}
								maxLength={120}
								onChange={(e) => update(index, { name: e.target.value })}
								placeholder='Nombre'
								className={`${controlClass} min-w-48 flex-1`}
							/>
						)}
						<span className='flex gap-1'>
							<button type='button' aria-label='Subir' disabled={index === 0} onClick={() => move(index, -1)} className='cursor-pointer disabled:opacity-30'>
								<MSOIcon className='text-xl'>arrow_upward</MSOIcon>
							</button>
							<button type='button' aria-label='Bajar' disabled={index === rows.length - 1} onClick={() => move(index, 1)} className='cursor-pointer disabled:opacity-30'>
								<MSOIcon className='text-xl'>arrow_downward</MSOIcon>
							</button>
							<button type='button' aria-label='Quitar autor' onClick={() => remove(index)} className='cursor-pointer text-red-400'>
								<MSOIcon className='text-xl'>delete</MSOIcon>
							</button>
						</span>
					</li>
				))}
			</ul>
			<button
				type='button'
				onClick={() => setRows((current) => [...current, { type: 'member', memberId: '', name: '' }])}
				className='mt-1 w-fit cursor-pointer text-sm underline'>
				+ Añadir autor
			</button>
		</Field>
	);
}
