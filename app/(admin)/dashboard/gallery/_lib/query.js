// Filtros del listado del dashboard: viven en la URL (?category=live&members=silvia,nico...)
// para poder compartir, volver atrás y paginar con enlaces normales.

const first = (value) => (Array.isArray(value) ? value[0] : value);
const toBoolean = (value) => (value === 'true' ? true : value === 'false' ? false : undefined);

// searchParams de Next → filtros de GalleryImagesService.list
export function parseGalleryQuery(searchParams) {
	const members = [searchParams.members].flat().flatMap((value) => String(value ?? '').split(','));

	return {
		category: first(searchParams.category),
		eventId: first(searchParams.event),
		memberSlugs: members.filter(Boolean),
		memberMatch: first(searchParams.match) === 'any' ? 'any' : 'all',
		active: toBoolean(first(searchParams.active)),
		search: first(searchParams.q),
		takenFrom: first(searchParams.from),
		takenTo: first(searchParams.to),
		withoutAlt: first(searchParams.noalt) === 'true' ? true : undefined,
		cursor: first(searchParams.cursor),
	};
}

// Enlace al listado conservando los filtros actuales; `overrides` cambia/quita parámetros
export function galleryListUrl(searchParams, overrides = {}) {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries({ ...searchParams, ...overrides })) {
		for (const item of [value].flat()) {
			if (item !== undefined && item !== null && item !== '') params.append(key, item);
		}
	}

	const query = params.toString();
	return query ? `/dashboard/gallery?${query}` : '/dashboard/gallery';
}
