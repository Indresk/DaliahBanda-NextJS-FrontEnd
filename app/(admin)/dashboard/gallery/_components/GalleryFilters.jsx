import Link from 'next/link';
import Field, { controlClass } from '@/frontend/components/ui/Field';
import { GALLERY_CATEGORIES } from '@/shared/constants';
import MemberCheckboxes from './MemberCheckboxes';

// Formulario GET: no necesita JavaScript, deja los filtros en la URL
export default function GalleryFilters({ query, events, people }) {
	return (
		<form method='get' action='/dashboard/gallery' className='mb-6 flex flex-col gap-4 bg-darkgray p-4'>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<Field label='Buscar en el texto alternativo' htmlFor='f-q'>
					<input id='f-q' name='q' defaultValue={query.search ?? ''} className={controlClass} />
				</Field>
				<Field label='Categoría' htmlFor='f-category'>
					<select id='f-category' name='category' defaultValue={query.category ?? ''} className={controlClass}>
						<option value=''>Todas</option>
						{Object.values(GALLERY_CATEGORIES).map((category) => (
							<option key={category} value={category}>{category}</option>
						))}
					</select>
				</Field>
				<Field label='Evento' htmlFor='f-event'>
					<select id='f-event' name='event' defaultValue={query.eventId ?? ''} className={controlClass}>
						<option value=''>Todos</option>
						{events.map((event) => (
							<option key={event.id} value={event.id}>{event.title}</option>
						))}
					</select>
				</Field>
				<Field label='Estado' htmlFor='f-active'>
					<select
						id='f-active'
						name='active'
						defaultValue={query.active === undefined ? '' : String(query.active)}
						className={controlClass}>
						<option value=''>Todas</option>
						<option value='true'>Activas</option>
						<option value='false'>Inactivas</option>
					</select>
				</Field>
				<Field label='Desde' htmlFor='f-from'>
					<input id='f-from' type='date' name='from' defaultValue={query.takenFrom ?? ''} className={controlClass} />
				</Field>
				<Field label='Hasta' htmlFor='f-to'>
					<input id='f-to' type='date' name='to' defaultValue={query.takenTo ?? ''} className={controlClass} />
				</Field>
				<Field label='Si hay varios integrantes' htmlFor='f-match'>
					<select id='f-match' name='match' defaultValue={query.memberMatch} className={controlClass}>
						<option value='all'>Aparecen todos</option>
						<option value='any'>Aparece alguno</option>
					</select>
				</Field>
				<label className='flex items-end gap-2 pb-2 text-sm'>
					<input type='checkbox' name='noalt' value='true' defaultChecked={query.withoutAlt === true} />
					Solo sin texto alternativo
				</label>
			</div>

			<Field label='Integrantes'>
				<MemberCheckboxes people={people} selected={query.memberSlugs} name='members' />
			</Field>

			<div className='flex gap-3'>
				<button type='submit' className='cursor-pointer bg-primary px-4 py-2 font-headline text-sm font-bold uppercase'>
					Filtrar
				</button>
				<Link href='/dashboard/gallery' className='px-4 py-2 font-headline text-sm uppercase underline'>
					Limpiar
				</Link>
			</div>
		</form>
	);
}
