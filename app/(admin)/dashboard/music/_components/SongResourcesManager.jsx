'use client';

import Badge from '@/frontend/components/ui/Badge';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import {
	createSongResource,
	deleteSongResource,
	updateSongResource,
} from '@/back/actions/songs.actions';
import { SONG_RESOURCE_KINDS } from '@/shared/constants';
import ChildItem from '../../_components/ChildItem';

const KIND_LABELS = {
	[SONG_RESOURCE_KINDS.STEM]: 'Stem',
	[SONG_RESOURCE_KINDS.SCORE]: 'Partitura',
	[SONG_RESOURCE_KINDS.LYRICS]: 'Letra y acordes',
	[SONG_RESOURCE_KINDS.VIDEO]: 'Video',
};

function ResourceForm({ songId, resource, action, submitLabel, resetOnSuccess = false }) {
	const { state, pending, handleSubmit } = useFormAction(action, { resetOnSuccess });
	const prefix = `res-${resource?.id ?? 'new'}`;

	return (
		<form onSubmit={handleSubmit} className='grid gap-4 md:grid-cols-4'>
			<input type='hidden' name='songId' value={songId} />
			{resource && <input type='hidden' name='id' value={resource.id} />}
			<Field label='Tipo' htmlFor={`${prefix}-kind`}>
				<select id={`${prefix}-kind`} name='kind' defaultValue={resource?.kind ?? SONG_RESOURCE_KINDS.STEM} className={controlClass}>
					{Object.entries(KIND_LABELS).map(([value, label]) => (
						<option key={value} value={value}>{label}</option>
					))}
				</select>
			</Field>
			<Field label='Nombre' htmlFor={`${prefix}-label`}>
				<input id={`${prefix}-label`} name='label' required maxLength={120} defaultValue={resource?.label ?? ''} className={controlClass} />
			</Field>
			<Field label='Instrumento (stems)' htmlFor={`${prefix}-instrument`}>
				<input id={`${prefix}-instrument`} name='instrument' maxLength={80} defaultValue={resource?.instrument ?? ''} className={controlClass} />
			</Field>
			<Field label='Orden' htmlFor={`${prefix}-order`}>
				<input id={`${prefix}-order`} name='displayOrder' type='number' min={0} defaultValue={resource?.displayOrder ?? 0} className={controlClass} />
			</Field>
			<Field label='URL (https, puedes copiarla desde Assets)' htmlFor={`${prefix}-url`} className='md:col-span-4'>
				<input id={`${prefix}-url`} name='url' type='url' required defaultValue={resource?.url ?? ''} className={controlClass} />
			</Field>
			<div className='flex items-center gap-4 md:col-span-4'>
				<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>{submitLabel}</Button>
				<FeedbackMessage result={state} />
			</div>
		</form>
	);
}

// Stems por instrumento, partituras, letra y acordes, y videos de una canción
export default function SongResourcesManager({ songId, resources }) {
	return (
		<div className='flex flex-col gap-6'>
			<ResourceForm songId={songId} action={createSongResource} submitLabel='Añadir recurso' resetOnSuccess />
			<ul>
				{resources.map((resource) => (
					<ChildItem
						key={resource.id}
						id={resource.id}
						label={`"${resource.label}"`}
						onDelete={deleteSongResource}
						summary={
							<>
								<Badge tone='neutral'>{KIND_LABELS[resource.kind]}</Badge>
								<strong>{resource.label}</strong>
								{resource.instrument && <span className='text-xs text-lightgray'>{resource.instrument}</span>}
								<span className='truncate text-xs text-lightgray'>{resource.url}</span>
							</>
						}
						editForm={<ResourceForm songId={songId} resource={resource} action={updateSongResource} submitLabel='Guardar' />}
					/>
				))}
			</ul>
		</div>
	);
}
