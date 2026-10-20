'use client';

import { useState, useTransition } from 'react';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import {
	createGalleryPerson,
	deleteGalleryPerson,
	updateGalleryPerson,
} from '@/back/actions/galleryPeople.actions';

function CreatePersonForm() {
	const { state, pending, handleSubmit } = useFormAction(createGalleryPerson, { resetOnSuccess: true });

	return (
		<form onSubmit={handleSubmit} className='grid gap-4 md:grid-cols-3'>
			<Field label='Identificador (slug, no se puede cambiar)' htmlFor='p-slug'>
				<input id='p-slug' name='slug' required maxLength={80} pattern='[a-z0-9]+(-[a-z0-9]+)*' className={controlClass} />
			</Field>
			<Field label='Nombre' htmlFor='p-name'>
				<input id='p-name' name='name' required maxLength={80} className={controlClass} />
			</Field>
			<label className='flex items-end gap-2 pb-2 text-sm'>
				<input type='checkbox' name='isMember' />
				Integrante actual (aparece en los filtros públicos)
			</label>
			<div className='flex items-center gap-4 md:col-span-3'>
				<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>Crear integrante</Button>
				<FeedbackMessage result={state} />
			</div>
		</form>
	);
}

function PersonRow({ person }) {
	const [editing, setEditing] = useState(false);
	const { state, pending: saving, handleSubmit } = useFormAction(updateGalleryPerson);
	const [deleteResult, setDeleteResult] = useState(null);
	const [pending, startTransition] = useTransition();

	function handleDelete() {
		if (!window.confirm(`¿Eliminar a "${person.name}"?`)) return;
		startTransition(async () => setDeleteResult(await deleteGalleryPerson(person.id)));
	}

	return (
		<li className='border-t border-black py-3'>
			<div className='flex flex-wrap items-center gap-3'>
				<strong>{person.name}</strong>
				<Badge tone={person.isMember ? 'ok' : 'neutral'}>{person.isMember ? 'Integrante actual' : 'Anterior / invitado'}</Badge>
				<span className='text-xs text-lightgray'>/{person.slug}</span>
				<span className='ml-auto flex gap-4 text-xs'>
					<button type='button' onClick={() => setEditing((value) => !value)} className='cursor-pointer underline'>
						{editing ? 'Cerrar' : 'Editar'}
					</button>
					<button type='button' disabled={pending} onClick={handleDelete} className='cursor-pointer text-red-400 underline disabled:opacity-50'>
						Eliminar
					</button>
				</span>
			</div>
			<FeedbackMessage result={deleteResult} />
			{editing && (
				<form onSubmit={handleSubmit} className='mt-3 flex flex-wrap items-end gap-4'>
					<input type='hidden' name='id' value={person.id} />
					<Field label='Nombre' htmlFor={`pn-${person.id}`}>
						<input id={`pn-${person.id}`} name='name' required maxLength={80} defaultValue={person.name} className={controlClass} />
					</Field>
					<label className='flex items-center gap-2 pb-2 text-sm'>
						<input type='checkbox' name='isMember' defaultChecked={person.isMember} />
						Integrante actual
					</label>
					<Button type='submit' size='sm' variant={saving ? 'disabled' : 'primary'}>Guardar</Button>
					<FeedbackMessage result={state} />
				</form>
			)}
		</li>
	);
}

export default function PeopleManager({ people }) {
	return (
		<div className='flex flex-col gap-6'>
			<Card title='Nuevo integrante o invitado'>
				<CreatePersonForm />
			</Card>
			<Card title={`Personas (${people.length})`}>
				<ul>
					{people.map((person) => (
						<PersonRow key={person.id} person={person} />
					))}
				</ul>
			</Card>
		</div>
	);
}
