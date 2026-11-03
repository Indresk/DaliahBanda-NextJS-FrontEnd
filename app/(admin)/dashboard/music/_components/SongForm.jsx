'use client';

import Link from 'next/link';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import ImageUrlFields from '@/frontend/components/ui/ImageUrlFields';
import Button from '@/frontend/components/buttons/GeneralButton';
import TextEditor from '@/frontend/components/inputs/TextEditor/TextEditorLoader';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import { createSong, updateSong } from '@/back/actions/songs.actions';

const COVER_NAMES = { url: 'coverUrl', width: 'coverWidth', height: 'coverHeight' };

// Alta y edición de una canción de un álbum. En edición el slug no cambia (forma la URL pública).
export default function SongForm({ albumId, song, nextTrackNumber = 1 }) {
	const isEdit = Boolean(song);
	const { state, pending, handleSubmit } = useFormAction(isEdit ? updateSong : createSong);
	const backHref = `/dashboard/music/${albumId}`;

	return (
		<form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
			{isEdit ? <input type='hidden' name='id' value={song.id} /> : <input type='hidden' name='albumId' value={albumId} />}

			<div className='flex flex-col gap-4'>
				<div className='grid gap-4 sm:grid-cols-2'>
					<Field label='Título' htmlFor='s-title'>
						<input id='s-title' name='title' required maxLength={120} defaultValue={song?.title ?? ''} className={controlClass} />
					</Field>
					{!isEdit && (
						<Field label='Identificador (slug, no se puede cambiar)' htmlFor='s-slug' hint='Forma la URL: /albums/<álbum>/<slug>'>
							<input id='s-slug' name='slug' required maxLength={80} pattern='[a-z0-9]+(-[a-z0-9]+)*' className={controlClass} />
						</Field>
					)}
					<Field label='Número de pista' htmlFor='s-track'>
						<input id='s-track' name='trackNumber' type='number' min={1} required defaultValue={song?.trackNumber ?? nextTrackNumber} className={controlClass} />
					</Field>
					<Field label='Fecha de lanzamiento (opcional)' htmlFor='s-date' hint='Si se deja vacía se usa la del álbum.'>
						<input id='s-date' name='releasedAt' type='date' defaultValue={song?.releasedAt ?? ''} className={controlClass} />
					</Field>
				</div>
				<Field label='Descripción corta' htmlFor='s-short' hint='Máx. 300 caracteres. Aparece en la lista de pistas y en las sugerencias.'>
					<textarea id='s-short' name='shortDescription' rows={2} required maxLength={300} defaultValue={song?.shortDescription ?? ''} className={controlClass} />
				</Field>
				<Field label='Descripción larga (opcional)' htmlFor='s-long' hint='Encabezado de la página de la canción.'>
					<textarea id='s-long' name='longDescription' rows={4} maxLength={5000} defaultValue={song?.longDescription ?? ''} className={controlClass} />
				</Field>
				<Field label='Audio para el reproductor (URL https, opcional)' htmlFor='s-audio' hint='Copia la URL desde Assets. Sin audio, la canción no se puede reproducir en el sitio.'>
					<input id='s-audio' name='audioUrl' type='url' defaultValue={song?.audioUrl ?? ''} className={controlClass} />
				</Field>
			</div>

			<div className='flex flex-col gap-4'>
				<Field label='Temas que trata (uno por línea)' htmlFor='s-themes'>
					<textarea id='s-themes' name='themes' rows={4} defaultValue={(song?.themes ?? []).join('\n')} className={controlClass} />
				</Field>
				<Field label='Contenido de la canción (opcional)' hint='Texto enriquecido: títulos, listas, enlaces, imágenes (por URL, con su texto alternativo) y videos o iframes.'>
					<TextEditor name='story' defaultValue={song?.story ?? ''} />
				</Field>
				<Field label='Agradecimientos (opcional)' htmlFor='s-thanks'>
					<textarea id='s-thanks' name='acknowledgments' rows={4} maxLength={10000} defaultValue={song?.acknowledgments ?? ''} className={controlClass} />
				</Field>
				<details className='bg-black p-3'>
					<summary className='cursor-pointer text-sm text-lightgray'>Portada propia (opcional; si falta se usa la del álbum)</summary>
					<div className='mt-3 flex flex-col gap-4'>
						<ImageUrlFields
							idPrefix='sc'
							names={COVER_NAMES}
							urlLabel='Portada de la canción (URL)'
							required={false}
							initial={{ url: song?.coverUrl, width: song?.coverWidth, height: song?.coverHeight }}
						/>
					</div>
				</details>
				<label className='flex items-center gap-2 text-sm'>
					<input type='checkbox' name='featured' defaultChecked={song?.featured ?? false} />
					Destacada (la canción recomendada del inicio es la destacada más reciente)
				</label>
				<label className='flex items-center gap-2 text-sm'>
					<input type='checkbox' name='active' defaultChecked={song?.active ?? false} />
					Publicada (visible en el sitio; también debe estar publicado su álbum)
				</label>
				<div className='flex flex-wrap items-center gap-4'>
					<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>
						{isEdit ? 'Guardar cambios' : 'Crear canción'}
					</Button>
					<Link href={backHref} className='text-sm underline'>Volver al álbum</Link>
				</div>
				<FeedbackMessage result={state} />
				{!isEdit && state?.status === 'success' && (
					<Link href={`${backHref}/songs/${state.payload.id}`} className='text-sm underline'>
						Añadir enlaces y recursos
					</Link>
				)}
			</div>
		</form>
	);
}
