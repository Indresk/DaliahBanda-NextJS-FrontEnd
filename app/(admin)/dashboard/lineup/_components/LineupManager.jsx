'use client';

import { useState, useTransition } from 'react';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import {
	createLineupEntry,
	deleteLineupEntry,
	updateLineupEntry,
} from '@/back/actions/lineup.actions';

// Campos comunes de crear y editar una entrada
function EntryFields({ entry, members, idPrefix }) {
	return (
		<div className='grid gap-4 md:grid-cols-3'>
			<Field label='Miembro con página (opcional)' htmlFor={`${idPrefix}-member`} hint='Enlaza a su página y toma su nombre si no escribes uno.'>
				<select id={`${idPrefix}-member`} name='memberId' defaultValue={entry?.memberId ?? ''} className={controlClass}>
					<option value=''>Sin vincular (persona anterior)</option>
					{members.map((member) => (
						<option key={member.id} value={member.id}>{member.name}</option>
					))}
				</select>
			</Field>
			<Field label='Nombre' htmlFor={`${idPrefix}-name`}>
				<input id={`${idPrefix}-name`} name='personName' maxLength={120} defaultValue={entry?.personName ?? ''} className={controlClass} />
			</Field>
			<Field label='Rol / instrumento' htmlFor={`${idPrefix}-role`}>
				<input id={`${idPrefix}-role`} name='role' required maxLength={120} defaultValue={entry?.role ?? ''} className={controlClass} />
			</Field>
			<Field label='Desde (año)' htmlFor={`${idPrefix}-start`}>
				<input id={`${idPrefix}-start`} name='startYear' type='number' min={1990} max={2100} required defaultValue={entry?.startYear ?? ''} className={controlClass} />
			</Field>
			<Field label='Hasta (año, vacío = sigue)' htmlFor={`${idPrefix}-end`}>
				<input id={`${idPrefix}-end`} name='endYear' type='number' min={1990} max={2100} defaultValue={entry?.endYear ?? ''} className={controlClass} />
			</Field>
			<Field label='Nota (opcional)' htmlFor={`${idPrefix}-note`}>
				<input id={`${idPrefix}-note`} name='note' maxLength={300} defaultValue={entry?.note ?? ''} className={controlClass} />
			</Field>
		</div>
	);
}

function CreateEntryForm({ members }) {
	const { state, pending, handleSubmit } = useFormAction(createLineupEntry, { resetOnSuccess: true });

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
			<EntryFields idPrefix='new' members={members} />
			<div className='flex items-center gap-4'>
				<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>Añadir entrada</Button>
				<FeedbackMessage result={state} />
			</div>
		</form>
	);
}

function EntryRow({ entry, members }) {
	const [editing, setEditing] = useState(false);
	const { state, pending: saving, handleSubmit } = useFormAction(updateLineupEntry);
	const [deleteResult, setDeleteResult] = useState(null);
	const [pending, startTransition] = useTransition();

	function handleDelete() {
		if (!window.confirm(`¿Eliminar a "${entry.personName}" (${entry.role})?`)) return;
		startTransition(async () => setDeleteResult(await deleteLineupEntry(entry.id)));
	}

	return (
		<li className='border-t border-black py-3'>
			<div className='flex flex-wrap items-center gap-3'>
				<span className='w-28 shrink-0 text-primary-light'>
					{entry.startYear}{entry.endYear === null ? ' – hoy' : entry.endYear === entry.startYear ? '' : ` – ${entry.endYear}`}
				</span>
				<strong>{entry.personName}</strong>
				<span className='text-sm text-lightgray'>{entry.role}</span>
				{entry.memberId && <Badge tone='warn'>Con página</Badge>}
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
				<form onSubmit={handleSubmit} className='mt-3 flex flex-col gap-4'>
					<input type='hidden' name='id' value={entry.id} />
					<EntryFields idPrefix={`e${entry.id}`} entry={entry} members={members} />
					<div className='flex items-center gap-4'>
						<Button type='submit' size='sm' variant={saving ? 'disabled' : 'primary'}>Guardar</Button>
						<FeedbackMessage result={state} />
					</div>
				</form>
			)}
		</li>
	);
}

export default function LineupManager({ entries, members }) {
	return (
		<div className='flex flex-col gap-6'>
			<Card title='Nueva entrada'>
				<CreateEntryForm members={members} />
			</Card>
			<Card
				title={`Línea del tiempo (${entries.length})`}
				action={
					<a href='/dashboard/lineup/export' download className='font-headline text-sm uppercase underline'>
						Exportar JSON (para seed)
					</a>
				}>
				<ul>
					{entries.map((entry) => (
						<EntryRow key={entry.id} entry={entry} members={members} />
					))}
				</ul>
			</Card>
		</div>
	);
}
