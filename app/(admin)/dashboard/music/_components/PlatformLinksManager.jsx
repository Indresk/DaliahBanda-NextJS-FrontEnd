'use client';

import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import { STREAMING_PLATFORMS } from '@/shared/constants';
import ChildItem from '../../_components/ChildItem';

// Alta y edición de un enlace de escucha por plataforma
function LinkForm({ parentKey, parentId, link, action, submitLabel, resetOnSuccess = false }) {
	const { state, pending, handleSubmit } = useFormAction(action, { resetOnSuccess });
	const prefix = `${parentKey}-link-${link?.id ?? 'new'}`;

	return (
		<form onSubmit={handleSubmit} className='grid gap-4 md:grid-cols-3'>
			<input type='hidden' name={parentKey} value={parentId} />
			{link && <input type='hidden' name='id' value={link.id} />}
			<Field label='Plataforma' htmlFor={`${prefix}-platform`}>
				<select id={`${prefix}-platform`} name='platform' defaultValue={link?.platform ?? 'spotify'} className={controlClass}>
					{Object.entries(STREAMING_PLATFORMS).map(([value, label]) => (
						<option key={value} value={value}>{label}</option>
					))}
				</select>
			</Field>
			<Field label='URL (https)' htmlFor={`${prefix}-url`}>
				<input id={`${prefix}-url`} name='url' type='url' required defaultValue={link?.url ?? ''} className={controlClass} />
			</Field>
			<Field label='Orden' htmlFor={`${prefix}-order`}>
				<input id={`${prefix}-order`} name='displayOrder' type='number' min={0} defaultValue={link?.displayOrder ?? 0} className={controlClass} />
			</Field>
			<div className='flex items-center gap-4 md:col-span-3'>
				<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>{submitLabel}</Button>
				<FeedbackMessage result={state} />
			</div>
		</form>
	);
}

// Enlaces de escucha de un álbum o de una canción: `parentKey` es "albumId" o "songId" y
// `actions` { create, update, remove } son las acciones del servidor de cada uno
export default function PlatformLinksManager({ parentKey, parentId, links, actions }) {
	return (
		<div className='flex flex-col gap-6'>
			<LinkForm parentKey={parentKey} parentId={parentId} action={actions.create} submitLabel='Añadir enlace' resetOnSuccess />
			<ul>
				{links.map((link) => (
					<ChildItem
						key={link.id}
						id={link.id}
						label={`el enlace de ${STREAMING_PLATFORMS[link.platform] ?? link.platform}`}
						onDelete={actions.remove}
						summary={
							<>
								<strong>{STREAMING_PLATFORMS[link.platform] ?? link.platform}</strong>
								<span className='truncate text-xs text-lightgray'>{link.url}</span>
							</>
						}
						editForm={
							<LinkForm parentKey={parentKey} parentId={parentId} link={link} action={actions.update} submitLabel='Guardar' />
						}
					/>
				))}
			</ul>
		</div>
	);
}
