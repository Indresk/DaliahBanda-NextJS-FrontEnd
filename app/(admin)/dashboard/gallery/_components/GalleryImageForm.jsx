'use client';

import Link from 'next/link';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import ImageUrlFields from '@/frontend/components/ui/ImageUrlFields';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useFormAction } from '@/frontend/hooks/useFormAction';
import {
	createGalleryImage,
	updateGalleryImage,
} from '@/back/actions/galleryImages.actions';
import { GALLERY, GALLERY_CATEGORIES } from '@/shared/constants';
import MemberCheckboxes from './MemberCheckboxes';

const today = () => new Date().toISOString().slice(0, 10);

// Alta y edición de una imagen. En edición la URL no cambia (identifica la imagen).
export default function GalleryImageForm({ image, initialUrl = '', events, people }) {
	const isEdit = Boolean(image);
	const { state, pending, handleSubmit } = useFormAction(isEdit ? updateGalleryImage : createGalleryImage);

	return (
		<form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
			{isEdit && <input type='hidden' name='id' value={image.id} />}

			<div className='flex flex-col gap-4'>
				<ImageUrlFields
					idPrefix='g'
					initial={{ url: image?.url ?? initialUrl, width: image?.width, height: image?.height }}
					readOnly={isEdit}
					urlHint={isEdit ? 'No se puede cambiar.' : 'Pega una URL https o llega aquí desde Assets.'}
				/>
			</div>

			<div className='flex flex-col gap-4'>
				<Field
					label='Texto alternativo (alt)'
					htmlFor='g-alt'
					hint={`Describe la foto para personas que no la ven y para buscadores. Obligatorio para publicarla. Máx. ${GALLERY.MAX_ALT_LENGTH} caracteres.`}>
					<textarea id='g-alt' name='alt' rows={4} maxLength={GALLERY.MAX_ALT_LENGTH} defaultValue={image?.alt ?? ''} className={controlClass} />
				</Field>
				<div className='grid gap-4 sm:grid-cols-2'>
					<Field label='Categoría' htmlFor='g-category'>
						<select id='g-category' name='category' defaultValue={image?.category ?? GALLERY_CATEGORIES.LIVE} className={controlClass}>
							{Object.values(GALLERY_CATEGORIES).map((category) => (
								<option key={category} value={category}>{category}</option>
							))}
						</select>
					</Field>
					<Field label='Evento' htmlFor='g-event'>
						<select id='g-event' name='eventId' required defaultValue={image?.eventId ?? ''} className={controlClass}>
							<option value='' disabled>Elegir…</option>
							{events.map((event) => (
								<option key={event.id} value={event.id}>{event.title}</option>
							))}
						</select>
					</Field>
				</div>
				<Field label='Fecha de la foto' htmlFor='g-date'>
					<input id='g-date' name='takenAt' type='date' required defaultValue={image?.takenAt ?? today()} className={controlClass} />
				</Field>
				<Field label='Integrantes que aparecen'>
					<MemberCheckboxes people={people} selected={image?.memberSlugs ?? []} />
				</Field>
				<label className='flex items-center gap-2 text-sm'>
					<input type='checkbox' name='active' defaultChecked={image?.active ?? false} />
					Activa (visible en la galería pública; requiere texto alternativo)
				</label>

				<div className='flex flex-wrap items-center gap-4'>
					<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>
						{isEdit ? 'Guardar cambios' : 'Añadir a la galería'}
					</Button>
					<Link href='/dashboard/gallery' className='text-sm underline'>Volver a la lista</Link>
				</div>
				<FeedbackMessage result={state} />
				{!isEdit && state?.status === 'success' && (
					<Link href={`/dashboard/gallery/${state.payload.id}`} className='text-sm underline'>
						Ver o editar la imagen añadida
					</Link>
				)}
			</div>
		</form>
	);
}
