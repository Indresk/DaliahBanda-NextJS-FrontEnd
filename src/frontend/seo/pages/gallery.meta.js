import { humanizeSlug } from '../buildMetadata';

// Las páginas de la galería leen de la base de datos: reciben el evento o la persona ya
// cargados. Si el contenido no existe, la página responde 404 antes de llegar aquí.
export const galleryMeta = {
	title: 'Galería',
	description:
		'Fotos de los shows y eventos en vivo de Daliah Banda: Rock And Blend, Universidad San Buenaventura y más escenarios de la escena rock bogotana.',
	path: '/gallery',
};

export const galleryBackstageMeta = {
	title: 'Backstage',
	description:
		'Fotos del backstage de Daliah Banda: ensayos, grabaciones, camerinos y bastidores de los shows.',
	path: '/gallery/backstage',
};

export const galleryFilterMeta = (person) => ({
	title: `Fotos de ${person.name}`,
	description: `Fotos de ${person.name} con Daliah Banda: shows, ensayos y backstage.`,
	path: `/gallery/${person.slug}`,
});

export const galleryEventMeta = (event) => ({
	title: `${event.title} - Fotos`,
	description:
		event.description ||
		`Fotos del evento ${event.title}, presentación en vivo de Daliah Banda.`,
	path: `/gallery/events/${event.slug}`,
});

// Título provisional si la página aún no pudo cargar el contenido
export const galleryFallbackMeta = (slug) => ({
	title: `Galería: ${humanizeSlug(slug)}`,
	description: 'Fotos de Daliah Banda.',
	path: '/gallery',
	indexable: false,
});
