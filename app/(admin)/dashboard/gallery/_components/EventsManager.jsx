'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import {
	createGalleryEvent,
	deleteGalleryEvent,
	updateGalleryEvent,
} from '@/back/actions/galleryEvents.actions';
import { formatDateOnly } from '@/shared/utils/format';

// Campos comunes de crear y editar un evento
function EventFields({ event, idPrefix }) {
	return (
		<div className='grid gap-4 md:grid-cols-2'>
			<Field label='Título' htmlFor={`${idPrefix}-title`}>
				<input id={`${idPrefix}-title`} name='title' required maxLength={120} defaultValue={event?.title ?? ''} className={controlClass} />
			</Field>
			<Field label='Fecha del evento' htmlFor={`${idPrefix}-date`}>
				<input id={`${idPrefix}-date`} name='eventDate' type='date' defaultValue={event?.eventDate ?? ''} className={controlClass} />
			</Field>
			<Field label='Descripción (opcional)' htmlFor={`${idPrefix}-desc`} className='md:col-span-2'>
				<textarea id={`${idPrefix}-desc`} name='description' rows={2} maxLength={1000} defaultValue={event?.description ?? ''} className={controlClass} />
			</Field>
			<Field label='Portada (URL de una imagen del evento, opcional)' htmlFor={`${idPrefix}-cover`} hint='Si se deja vacía se usa la imagen activa más reciente.'>
				<input id={`${idPrefix}-cover`} name='coverUrl' type='url' defaultValue={event?.coverUrl ?? ''} className={controlClass} />
			</Field>
			<label className='flex items-center gap-2 self-end pb-2 text-sm'>
				<input type='checkbox' name='isFeatured' defaultChecked={event?.isFeatured ?? false} />
				Destacado (ocupa un lugar grande en el índice de la galería)
			</label>
		</div>
	);
}

function CreateEventForm() {
	const { state, pending, handleSubmit } = useFormAction(createGalleryEvent, { resetOnSuccess: true });

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
			<Field label='Identificador (slug, forma la URL y no se puede cambiar)' htmlFor='new-slug' hint='Solo minúsculas, números y guiones. Ej.: rock-and-blend-4'>
				<input id='new-slug' name='slug' required maxLength={80} pattern='[a-z0-9]+(-[a-z0-9]+)*' className={controlClass} />
			</Field>
			<EventFields idPrefix='new' />
			<div className='flex items-center gap-4'>
				<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>Crear evento</Button>
				<FeedbackMessage result={state} />
			</div>
		</form>
	);
}

function EventRow({ event }) {
	const [editing, setEditing] = useState(false);
	const { state, pending: saving, handleSubmit } = useFormAction(updateGalleryEvent);
	const [deleteResult, setDeleteResult] = useState(null);
	const [pending, startTransition] = useTransition();

	function handleDelete() {
		if (!window.confirm(`¿Eliminar el evento "${event.title}"?`)) return;
		startTransition(async () => setDeleteResult(await deleteGalleryEvent(event.id)));
	}

	return (
		<li className='border-t border-black py-4'>
			<div className='flex flex-wrap items-center gap-3'>
				<strong className='font-headline uppercase'>{event.title}</strong>
				{event.isFeatured && <Badge tone='live'>Destacado</Badge>}
				<span className='text-xs text-lightgray'>/{event.slug} · {formatDateOnly(event.eventDate)}</span>
				<span className='text-xs text-lightgray'>
					{event.activeImages} activas / {event.totalImages} imágenes
				</span>
				<span className='ml-auto flex gap-4 text-xs'>
					<Link href={`/dashboard/gallery?event=${event.id}`} className='underline'>Ver imágenes</Link>
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
				<form onSubmit={handleSubmit} className='mt-4 flex flex-col gap-4'>
					<input type='hidden' name='id' value={event.id} />
					<EventFields event={event} idPrefix={`ev${event.id}`} />
					<div className='flex items-center gap-4'>
						<Button type='submit' size='sm' variant={saving ? 'disabled' : 'primary'}>Guardar</Button>
						<FeedbackMessage result={state} />
					</div>
				</form>
			)}
		</li>
	);
}

export default function EventsManager({ events }) {
	return (
		<div className='flex flex-col gap-6'>
			<Card title='Nuevo evento'>
				<CreateEventForm />
			</Card>
			<Card title={`Eventos (${events.length})`}>
				<ul>
					{events.map((event) => (
						<EventRow key={event.id} event={event} />
					))}
				</ul>
			</Card>
		</div>
	);
}
