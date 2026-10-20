import Link from 'next/link';
import { requirePageRole } from '@/back/utils/sessionGuard';
import GalleryEventsService from '@/back/services/galleryEvents.service';
import GalleryImagesService from '@/back/services/galleryImages.service';
import GalleryPeopleService from '@/back/services/galleryPeople.service';
import { USER_ROLES } from '@/shared/constants';
import Card from '@/frontend/components/ui/Card';
import GalleryFilters from './_components/GalleryFilters';
import GalleryTable from './_components/GalleryTable';
import { galleryListUrl, parseGalleryQuery } from './_lib/query';

export default async function GalleryAdminPage({ searchParams }) {
	await requirePageRole([USER_ROLES.ADMIN]);
	const rawQuery = await searchParams;
	const query = parseGalleryQuery(rawQuery);

	const [events, people, facets] = await Promise.all([
		GalleryEventsService.findAll(),
		GalleryPeopleService.findAll(),
		GalleryImagesService.getFacets(),
	]);

	let result = null;
	let errorMessage = null;
	try {
		result = await GalleryImagesService.list(query, { admin: true });
	} catch (error) {
		errorMessage = error.message;
	}

	const total = Object.values(facets.categories).reduce((sum, count) => sum + count, 0);
	const items = result?.items.map(({ createdAt, updatedAt, ...item }) => item) ?? [];

	return (
		<>
			<p className='mb-4 text-sm text-lightgray'>
				{total} imágenes en total ·{' '}
				{Object.entries(facets.categories).map(([category, count]) => `${category}: ${count}`).join(' · ')}
			</p>

			<GalleryFilters query={query} events={events} people={people} />

			<Card>
				{errorMessage ? (
					<p role='alert' className='text-sm text-red-400'>{errorMessage}</p>
				) : items.length === 0 ? (
					<p className='text-sm text-lightgray'>No hay imágenes con esos filtros.</p>
				) : (
					<GalleryTable items={items} events={events} people={people} />
				)}

				<div className='mt-4 flex gap-4 text-sm'>
					{query.cursor && (
						<Link href={galleryListUrl(rawQuery, { cursor: undefined })} className='underline'>
							← Volver al inicio
						</Link>
					)}
					{result?.nextCursor && (
						<Link href={galleryListUrl(rawQuery, { cursor: result.nextCursor })} className='underline'>
							Siguientes →
						</Link>
					)}
				</div>
			</Card>
		</>
	);
}
