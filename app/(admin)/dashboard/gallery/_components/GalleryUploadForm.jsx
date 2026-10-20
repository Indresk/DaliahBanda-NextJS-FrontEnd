'use client';

import { useState } from 'react';
import Link from 'next/link';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useAssetUploads } from '@/frontend/hooks/useAssetUploads';
import { createGalleryImagesBatch } from '@/back/actions/galleryImages.actions';
import { GALLERY, GALLERY_CATEGORIES } from '@/shared/constants';
import UploadProgressList from '../../_components/UploadProgressList';
import MemberCheckboxes from './MemberCheckboxes';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILES = 50;

// Dimensiones reales de la imagen, antes de subirla
async function readDimensions(file) {
	const bitmap = await createImageBitmap(file);
	const { width, height } = bitmap;
	bitmap.close();
	return { width, height };
}

// Sube varias imágenes al bucket (carpeta images/<categoría>/<evento>/) y las registra en
// la galería con los mismos datos. Sin texto alternativo común quedan inactivas, para
// completarlas después en la lista.
export default function GalleryUploadForm({ events, people }) {
	const [category, setCategory] = useState(GALLERY_CATEGORIES.LIVE);
	const [eventId, setEventId] = useState(events[0] ? String(events[0].id) : '');
	const [summary, setSummary] = useState(null);

	const event = events.find((item) => String(item.id) === eventId);
	const prefix = event ? `images/${category}/${event.slug}/` : '';
	const { items, pending, upload } = useAssetUploads(prefix);

	async function handleSubmit(submitEvent) {
		submitEvent.preventDefault();
		setSummary(null);
		const form = new FormData(submitEvent.currentTarget);
		const alt = String(form.get('alt') ?? '').trim();
		const active = form.get('active') === 'on';

		if (active && !alt) {
			return setSummary({ status: 'error', message: 'Para publicar al subir indica un texto alternativo común.' });
		}

		const files = form
			.getAll('files')
			.filter((file) => file.size > 0 && IMAGE_TYPES.includes(file.type))
			.slice(0, MAX_FILES);
		if (files.length === 0 || !prefix) {
			return setSummary({ status: 'error', message: 'Elige imágenes (JPG, PNG, WebP o GIF) y un evento.' });
		}

		const dimensions = await Promise.all(files.map(readDimensions));
		const shared = {
			category,
			eventId: Number(eventId),
			takenAt: form.get('takenAt'),
			memberSlugs: form.getAll('memberSlugs'),
			alt,
			active,
		};

		upload(files, async (results) => {
			const uploaded = results
				.map((result, index) => ({ ...result, ...dimensions[index] }))
				.filter((result) => result.ok)
				.map(({ url, width, height }) => ({ url, width, height }));
			if (uploaded.length === 0) return;

			setSummary(await createGalleryImagesBatch({ shared, items: uploaded }));
		});
	}

	return (
		<form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
			<div className='flex flex-col gap-4'>
				<Field label='Imágenes' htmlFor='u-files' hint={`Hasta ${MAX_FILES} por lote; se suben una a una.`}>
					<input id='u-files' name='files' type='file' multiple required accept={IMAGE_TYPES.join(',')} className={`${controlClass} file:mr-4 file:cursor-pointer file:border-0 file:bg-primary file:px-3 file:py-1 file:text-white`} />
				</Field>
				<div className='grid gap-4 sm:grid-cols-2'>
					<Field label='Categoría' htmlFor='u-category'>
						<select id='u-category' value={category} onChange={(e) => setCategory(e.target.value)} className={controlClass}>
							{Object.values(GALLERY_CATEGORIES).map((value) => (
								<option key={value} value={value}>{value}</option>
							))}
						</select>
					</Field>
					<Field label='Evento' htmlFor='u-event'>
						<select id='u-event' value={eventId} onChange={(e) => setEventId(e.target.value)} className={controlClass}>
							{events.map((item) => (
								<option key={item.id} value={item.id}>{item.title}</option>
							))}
						</select>
					</Field>
				</div>
				<p className='text-xs text-lightgray'>
					Se guardan en <code>/{prefix}</code> del bucket.
				</p>
				<Field label='Fecha de las fotos' htmlFor='u-date'>
					<input id='u-date' name='takenAt' type='date' required defaultValue={event?.eventDate ?? new Date().toISOString().slice(0, 10)} className={controlClass} />
				</Field>
			</div>

			<div className='flex flex-col gap-4'>
				<Field label='Integrantes que aparecen (todas las fotos)'>
					<MemberCheckboxes people={people} />
				</Field>
				<Field
					label='Texto alternativo común (opcional)'
					htmlFor='u-alt'
					hint='Si lo dejas vacío, las imágenes quedan inactivas hasta que les pongas su propio alt en la lista.'>
					<textarea id='u-alt' name='alt' rows={3} maxLength={GALLERY.MAX_ALT_LENGTH} className={controlClass} />
				</Field>
				<label className='flex items-center gap-2 text-sm'>
					<input type='checkbox' name='active' />
					Publicar al terminar (requiere el texto alternativo común)
				</label>
				<div>
					<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>
						{pending ? 'Subiendo…' : 'Subir y añadir'}
					</Button>
				</div>

				<UploadProgressList items={items} />
				<FeedbackMessage result={summary} />
				{summary?.status === 'success' && (
					<Link href={`/dashboard/gallery?event=${eventId}&active=false`} className='text-sm underline'>
						Ver las imágenes inactivas de este evento
					</Link>
				)}
			</div>
		</form>
	);
}
