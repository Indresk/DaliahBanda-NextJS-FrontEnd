'use client';

import { useState } from 'react';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import {
	bulkUpdateGalleryImages,
	deleteGalleryImages,
} from '@/back/actions/galleryImages.actions';
import { GALLERY_CATEGORIES, GALLERY_MEMBER_MODES } from '@/shared/constants';

const MODE_LABELS = {
	[GALLERY_MEMBER_MODES.ADD]: 'Añadir a los que ya tienen',
	[GALLERY_MEMBER_MODES.REMOVE]: 'Quitar de los que los tienen',
	[GALLERY_MEMBER_MODES.SET]: 'Reemplazar por',
};

const buttonClass = 'cursor-pointer px-3 py-1 font-headline text-xs font-bold uppercase disabled:cursor-not-allowed disabled:opacity-50';

// Acciones sobre las imágenes marcadas. `run(llamada)` ejecuta la acción del servidor y
// muestra el resultado (lo resuelve GalleryTable).
export default function BulkActionsBar({ ids, events, people, run, pending }) {
	const [alsoDeleteFiles, setAlsoDeleteFiles] = useState(false);
	const [eventId, setEventId] = useState('');
	const [category, setCategory] = useState('');
	const [takenAt, setTakenAt] = useState('');
	const [mode, setMode] = useState(GALLERY_MEMBER_MODES.ADD);
	const [slugs, setSlugs] = useState([]);

	const change = (changes) => run(() => bulkUpdateGalleryImages({ ids, changes }));

	function handleDelete() {
		const files = alsoDeleteFiles ? ' y SUS ARCHIVOS del bucket (irreversible)' : '';
		if (!window.confirm(`¿Eliminar ${ids.length} imágenes de la galería${files}?`)) return;
		run(() => deleteGalleryImages({ ids, alsoDeleteFiles }));
	}

	function toggleSlug(slug) {
		setSlugs((previous) =>
			previous.includes(slug) ? previous.filter((item) => item !== slug) : [...previous, slug],
		);
	}

	return (
		<div className='sticky top-0 z-10 mb-4 flex flex-col gap-3 border border-primary bg-black p-4'>
			<div className='flex flex-wrap items-center gap-3'>
				<strong className='font-headline text-sm uppercase'>{ids.length} seleccionadas</strong>
				<button type='button' disabled={pending} onClick={() => change({ active: true })} className={`${buttonClass} bg-emerald-900`}>
					Activar
				</button>
				<button type='button' disabled={pending} onClick={() => change({ active: false })} className={`${buttonClass} bg-zinc-700`}>
					Desactivar
				</button>
				<button type='button' disabled={pending} onClick={handleDelete} className={`${buttonClass} bg-red-900`}>
					Eliminar
				</button>
				<label className='flex items-center gap-2 text-xs text-lightgray'>
					<input type='checkbox' checked={alsoDeleteFiles} onChange={(e) => setAlsoDeleteFiles(e.target.checked)} />
					Al eliminar, borrar también el archivo del bucket
				</label>
			</div>

			<details>
				<summary className='cursor-pointer text-sm underline'>Editar la selección</summary>
				<div className='mt-3 grid gap-4 md:grid-cols-2'>
					<div className='flex items-end gap-2'>
						<Field label='Evento' htmlFor='bulk-event' className='flex-1'>
							<select id='bulk-event' value={eventId} onChange={(e) => setEventId(e.target.value)} className={controlClass}>
								<option value=''>Elegir…</option>
								{events.map((event) => (
									<option key={event.id} value={event.id}>{event.title}</option>
								))}
							</select>
						</Field>
						<button type='button' disabled={pending || !eventId} onClick={() => change({ eventId: Number(eventId) })} className={`${buttonClass} bg-primary`}>
							Aplicar
						</button>
					</div>

					<div className='flex items-end gap-2'>
						<Field label='Categoría' htmlFor='bulk-category' className='flex-1'>
							<select id='bulk-category' value={category} onChange={(e) => setCategory(e.target.value)} className={controlClass}>
								<option value=''>Elegir…</option>
								{Object.values(GALLERY_CATEGORIES).map((value) => (
									<option key={value} value={value}>{value}</option>
								))}
							</select>
						</Field>
						<button type='button' disabled={pending || !category} onClick={() => change({ category })} className={`${buttonClass} bg-primary`}>
							Aplicar
						</button>
					</div>

					<div className='flex items-end gap-2'>
						<Field label='Fecha de la foto' htmlFor='bulk-date' className='flex-1'>
							<input id='bulk-date' type='date' value={takenAt} onChange={(e) => setTakenAt(e.target.value)} className={controlClass} />
						</Field>
						<button type='button' disabled={pending || !takenAt} onClick={() => change({ takenAt })} className={`${buttonClass} bg-primary`}>
							Aplicar
						</button>
					</div>

					<div className='flex flex-col gap-2'>
						<Field label='Integrantes' htmlFor='bulk-mode'>
							<select id='bulk-mode' value={mode} onChange={(e) => setMode(e.target.value)} className={controlClass}>
								{Object.entries(MODE_LABELS).map(([value, label]) => (
									<option key={value} value={value}>{label}</option>
								))}
							</select>
						</Field>
						<div className='flex flex-wrap gap-x-4 gap-y-1'>
							{people.map((person) => (
								<label key={person.slug} className='flex cursor-pointer items-center gap-2 text-sm'>
									<input type='checkbox' checked={slugs.includes(person.slug)} onChange={() => toggleSlug(person.slug)} />
									{person.name}
								</label>
							))}
						</div>
						<button
							type='button'
							disabled={pending || (slugs.length === 0 && mode !== GALLERY_MEMBER_MODES.SET)}
							onClick={() => change({ members: { mode, slugs } })}
							className={`${buttonClass} self-start bg-primary`}>
							Aplicar integrantes
						</button>
					</div>
				</div>
			</details>
		</div>
	);
}
