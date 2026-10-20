'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Badge from '@/frontend/components/ui/Badge';
import Card from '@/frontend/components/ui/Card';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import ImageUrlFields from '@/frontend/components/ui/ImageUrlFields';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import { createFlyer, deleteFlyer, updateFlyer } from '@/back/actions/flyers.actions';

function CreateFlyerForm() {
	const { state, pending, handleSubmit } = useFormAction(createFlyer, { resetOnSuccess: true });

	return (
		<form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
			<div className='flex flex-col gap-4'>
				<ImageUrlFields idPrefix='fl' withSize={false} urlHint='URL https de la imagen (puedes subirla desde Assets).' />
			</div>
			<div className='flex flex-col gap-4'>
				<Field label='Texto alternativo' htmlFor='fl-alt' hint='Describe el flyer (ej.: "Daliah Banda en el flyer del evento X").'>
					<textarea id='fl-alt' name='alt' rows={3} required maxLength={500} className={controlClass} />
				</Field>
				<Field label='Orden' htmlFor='fl-order' hint='Menor = primero.'>
					<input id='fl-order' name='displayOrder' type='number' min={0} defaultValue={0} className={controlClass} />
				</Field>
				<label className='flex items-center gap-2 text-sm'>
					<input type='checkbox' name='active' defaultChecked />
					Activo (visible en el sitio)
				</label>
				<div className='flex items-center gap-4'>
					<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>Añadir flyer</Button>
					<FeedbackMessage result={state} />
				</div>
			</div>
		</form>
	);
}

function FlyerRow({ flyer }) {
	const [editing, setEditing] = useState(false);
	const { state, pending: saving, handleSubmit } = useFormAction(updateFlyer);
	const [deleteResult, setDeleteResult] = useState(null);
	const [pending, startTransition] = useTransition();

	function handleDelete() {
		if (!window.confirm('¿Eliminar este flyer?')) return;
		startTransition(async () => setDeleteResult(await deleteFlyer(flyer.id)));
	}

	return (
		<li className='border-t border-black py-3'>
			<div className='flex flex-wrap items-center gap-3'>
				<div className='relative size-16 shrink-0 bg-black'>
					<Image src={flyer.url} alt={flyer.alt} fill unoptimized sizes='64px' className='object-cover' />
				</div>
				<span className='min-w-0 flex-1 truncate text-sm'>{flyer.alt}</span>
				<Badge tone={flyer.active ? 'ok' : 'neutral'}>{flyer.active ? 'Activo' : 'Oculto'}</Badge>
				<span className='text-xs text-lightgray'>Orden {flyer.displayOrder}</span>
				<span className='flex gap-4 text-xs'>
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
					<input type='hidden' name='id' value={flyer.id} />
					<Field label='Texto alternativo' htmlFor={`fa-${flyer.id}`} className='min-w-72 flex-1'>
						<input id={`fa-${flyer.id}`} name='alt' required maxLength={500} defaultValue={flyer.alt} className={controlClass} />
					</Field>
					<Field label='Orden' htmlFor={`fo-${flyer.id}`}>
						<input id={`fo-${flyer.id}`} name='displayOrder' type='number' min={0} defaultValue={flyer.displayOrder} className={controlClass} />
					</Field>
					<label className='flex items-center gap-2 pb-2 text-sm'>
						<input type='checkbox' name='active' defaultChecked={flyer.active} />
						Activo
					</label>
					<Button type='submit' size='sm' variant={saving ? 'disabled' : 'primary'}>Guardar</Button>
					<FeedbackMessage result={state} />
				</form>
			)}
		</li>
	);
}

export default function FlyersManager({ flyers }) {
	return (
		<div className='flex flex-col gap-6'>
			<Card title='Nuevo flyer'>
				<CreateFlyerForm />
			</Card>
			<Card
				title={`Flyers (${flyers.length})`}
				action={
					<a href='/dashboard/flyers/export' download className='font-headline text-sm uppercase underline'>
						Exportar JSON (para seed)
					</a>
				}>
				<ul>
					{flyers.map((flyer) => (
						<FlyerRow key={flyer.id} flyer={flyer} />
					))}
				</ul>
			</Card>
		</div>
	);
}
