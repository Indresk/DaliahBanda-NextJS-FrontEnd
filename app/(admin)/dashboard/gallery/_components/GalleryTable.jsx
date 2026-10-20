'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';
import Badge from '@/frontend/components/ui/Badge';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import { bulkUpdateGalleryImages } from '@/back/actions/galleryImages.actions';
import { formatDateOnly } from '@/shared/utils/format';
import { isOptimizedImageUrl } from '@/shared/utils/images';
import BulkActionsBar from './BulkActionsBar';

// Listado con selección múltiple. Las acciones se ejecutan en el servidor y la lista se
// refresca sola (las acciones revalidan /dashboard/gallery).
export default function GalleryTable({ items, events, people }) {
	const [selected, setSelected] = useState([]);
	const [result, setResult] = useState(null);
	const [pending, startTransition] = useTransition();

	const peopleBySlug = Object.fromEntries(people.map((person) => [person.slug, person.name]));
	const allSelected = items.length > 0 && selected.length === items.length;

	function run(call) {
		setResult(null);
		startTransition(async () => {
			const response = await call();
			setResult(response);
			if (response.status === 'success') setSelected([]);
		});
	}

	function toggle(id) {
		setSelected((previous) =>
			previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
		);
	}

	return (
		<div>
			{selected.length > 0 && (
				<BulkActionsBar ids={selected} events={events} people={people} run={run} pending={pending} />
			)}
			<FeedbackMessage result={result} />

			<table className='mt-2 w-full text-left text-sm'>
				<thead className='font-headline text-xs uppercase tracking-wider text-lightgray'>
					<tr>
						<th className='w-8 pb-2'>
							<input
								type='checkbox'
								aria-label='Seleccionar todas las de esta página'
								checked={allSelected}
								onChange={() => setSelected(allSelected ? [] : items.map((item) => item.id))}
							/>
						</th>
						<th className='pb-2 font-normal'>Imagen</th>
						<th className='pb-2 font-normal'>Detalle</th>
						<th className='hidden pb-2 font-normal md:table-cell'>Fecha</th>
						<th className='pb-2 font-normal'>Estado</th>
						<th className='pb-2'><span className='sr-only'>Editar</span></th>
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<tr key={item.id} className='border-t border-darkgray align-top'>
							<td className='py-3'>
								<input
									type='checkbox'
									aria-label={`Seleccionar imagen ${item.id}`}
									checked={selected.includes(item.id)}
									onChange={() => toggle(item.id)}
								/>
							</td>
							<td className='py-3 pr-3'>
								<div className='relative h-16 w-24 overflow-hidden bg-darkgray'>
									<Image src={item.url} alt={item.alt || 'Sin texto alternativo'} fill unoptimized={!isOptimizedImageUrl(item.url)} sizes='96px' className='object-cover' />
								</div>
							</td>
							<td className='py-3 pr-3'>
								<p className={item.alt ? 'line-clamp-2' : 'italic text-amber-400'}>
									{item.alt || 'Sin texto alternativo'}
								</p>
								<p className='mt-1 flex flex-wrap items-center gap-2 text-xs text-lightgray'>
									<Badge>{item.category}</Badge>
									<span>{item.event.title}</span>
									<span>· {item.memberSlugs.map((slug) => peopleBySlug[slug] ?? slug).join(', ') || 'sin integrantes'}</span>
								</p>
							</td>
							<td className='hidden py-3 pr-3 text-lightgray md:table-cell'>{formatDateOnly(item.takenAt)}</td>
							<td className='py-3 pr-3'>
								<button
									type='button'
									disabled={pending}
									onClick={() => run(() => bulkUpdateGalleryImages({ ids: [item.id], changes: { active: !item.active } }))}
									aria-label={item.active ? 'Desactivar' : 'Activar'}
									className='flex cursor-pointer items-center gap-1 disabled:opacity-50'>
									<MSOIcon className={item.active ? 'text-emerald-400' : 'text-lightgray'}>
										{item.active ? 'visibility' : 'visibility_off'}
									</MSOIcon>
									<span className='text-xs'>{item.active ? 'Activa' : 'Inactiva'}</span>
								</button>
							</td>
							<td className='py-3 text-right'>
								<Link href={`/dashboard/gallery/${item.id}`} className='text-xs underline'>Editar</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
