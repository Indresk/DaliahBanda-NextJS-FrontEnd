'use client';

import Link from 'next/link';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import ImageUrlFields from '@/frontend/components/ui/ImageUrlFields';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import { createAlbum, updateAlbum } from '@/back/actions/albums.actions';
import { ALBUM_TYPE_LABELS, ALBUM_TYPES } from '@/shared/constants';

const COVER_NAMES = { url: 'coverUrl', width: 'coverWidth', height: 'coverHeight' };

// Alta y edición de un álbum o sencillo. En edición el slug no cambia (forma la URL pública).
export default function AlbumForm({ album }) {
	const isEdit = Boolean(album);
	const { state, pending, handleSubmit } = useFormAction(isEdit ? updateAlbum : createAlbum);

	return (
		<form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
			{isEdit && <input type='hidden' name='id' value={album.id} />}

			<div className='flex flex-col gap-4'>
				<ImageUrlFields
					idPrefix='al'
					names={COVER_NAMES}
					urlLabel='Portada (URL)'
					initial={{ url: album?.coverUrl, width: album?.coverWidth, height: album?.coverHeight }}
				/>
			</div>

			<div className='flex flex-col gap-4'>
				<div className='grid gap-4 sm:grid-cols-2'>
					<Field label='Título' htmlFor='al-title'>
						<input id='al-title' name='title' required maxLength={120} defaultValue={album?.title ?? ''} className={controlClass} />
					</Field>
					<Field label='Tipo' htmlFor='al-type' hint='Un sencillo es un álbum de una sola canción.'>
						<select id='al-type' name='type' defaultValue={album?.type ?? ALBUM_TYPES.ALBUM} className={controlClass}>
							{Object.entries(ALBUM_TYPE_LABELS).map(([value, label]) => (
								<option key={value} value={value}>{label}</option>
							))}
						</select>
					</Field>
					{!isEdit && (
						<Field label='Identificador (slug, no se puede cambiar)' htmlFor='al-slug' hint='Forma la URL: /discografia/<slug>'>
							<input id='al-slug' name='slug' required maxLength={80} pattern='[a-z0-9]+(-[a-z0-9]+)*' className={controlClass} />
						</Field>
					)}
					<Field label='Fecha de lanzamiento' htmlFor='al-date'>
						<input id='al-date' name='releasedAt' type='date' required defaultValue={album?.releasedAt ?? ''} className={controlClass} />
					</Field>
				</div>
				<Field label='Frase corta (opcional)' htmlFor='al-tagline'>
					<input id='al-tagline' name='tagline' maxLength={200} defaultValue={album?.tagline ?? ''} className={controlClass} />
				</Field>
				<Field label='Sobre el álbum (opcional)' htmlFor='al-desc'>
					<textarea id='al-desc' name='description' rows={6} maxLength={5000} defaultValue={album?.description ?? ''} className={controlClass} />
				</Field>
				<label className='flex items-center gap-2 text-sm'>
					<input type='checkbox' name='active' defaultChecked={album?.active ?? false} />
					Publicado (visible en el sitio)
				</label>
				<div className='flex flex-wrap items-center gap-4'>
					<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>
						{isEdit ? 'Guardar cambios' : 'Crear'}
					</Button>
					<Link href='/dashboard/music' className='text-sm underline'>Volver a la lista</Link>
				</div>
				<FeedbackMessage result={state} />
				{!isEdit && state?.status === 'success' && (
					<Link href={`/dashboard/music/${state.payload.id}`} className='text-sm underline'>
						Añadir enlaces y canciones
					</Link>
				)}
			</div>
		</form>
	);
}
