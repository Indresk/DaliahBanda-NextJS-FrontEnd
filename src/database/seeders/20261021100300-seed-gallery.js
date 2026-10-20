'use strict';

// Carga inicial de la galería desde src/shared/lib/galleryImages.json.
// Es idempotente: solo inserta lo que falta, así `pnpm dev:db` puede repetirla sin errores.
// Los seeders son CommonJS (sequelize-cli): no pueden usar `import` para leer el JSON
// eslint-disable-next-line @typescript-eslint/no-require-imports
const galleryImages = require('../../shared/lib/galleryImages.json');

// Integrantes actuales: los únicos que aparecen en los filtros públicos
const CURRENT_MEMBERS = ['silvia', 'mike', 'rafa', 'aya', 'chris', 'nico'];

// Los títulos de eventos con * son una inferencia a partir del texto alt de sus fotos:
// revisarlos desde el dashboard (Galería > Eventos).
const EVENTS = {
	'rock-and-blend-2': { title: 'Rock And Blend 2', featured: true, cover: 'unal-show2-62-v1.jpg' },
	'rock-and-blend-3': { title: 'Rock And Blend 3', featured: true, cover: 'unal-postentrevista-3-v1.jpg' },
	'usb-2025': { title: 'Universidad San Buenaventura', featured: true, cover: 'backstage-usb2-v1.jpg' },
	'rock-and-blend-1': { title: 'Rock And Blend 1', cover: 'unal-cris-v1.jpeg' },
	misc: { title: 'Variado', cover: 'backstage-lunch-2022-v1.jpg' },
	'f-santa-isabel': { title: 'Fundación Santa Isabel' },
	'tv-unal': { title: 'Sesión TV UNAL' },
	recording: { title: 'Grabaciones' },
	cambridge: { title: 'Colegio Cambridge' },
	kaiju: { title: 'Kaiju Asian Pub' },
	'alfredo-iriarte': { title: 'Colegio Alfredo Iriarte' },
	grange: { title: 'Grange Bar' },
	garage: { title: 'Garage Salón de Eventos' },
	jackass: { title: 'Jackass Rock Bar' },
	spiral7: { title: 'Spiral 7' },
	'unal-carpa': { title: 'Carpa UNAL' },
	'unal-show-exterior': { title: 'Show exterior UNAL' },
};

const CHUNK = 100;

const humanize = (slug) =>
	slug.replace(/-/g, ' ').replace(/(^|\s)(\S)/g, (_, s, c) => s + c.toUpperCase());

// El JSON guarda segundos desde 1970; la fecha de la foto se guarda sin hora (UTC)
const toDate = (seconds) => new Date(seconds * 1000).toISOString().slice(0, 10);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const now = new Date();

		await queryInterface.sequelize.transaction(async (transaction) => {
			const options = { transaction };
			// Las lecturas deben usar la misma transacción para ver lo que se acaba de insertar
			const query = (sql) =>
				queryInterface.sequelize.query(sql, {
					type: Sequelize.QueryTypes.SELECT,
					transaction,
				});

			// 1) Integrantes
			const slugs = [...new Set(galleryImages.flatMap((image) => image.integranteIds))];
			const knownPeople = new Set(
				(await query('SELECT slug FROM "gallery-people"')).map((row) => row.slug),
			);
			const newPeople = slugs
				.filter((slug) => !knownPeople.has(slug))
				.map((slug) => ({
					slug,
					name: humanize(slug),
					isMember: CURRENT_MEMBERS.includes(slug),
					createdAt: now,
					updatedAt: now,
				}));
			if (newPeople.length) {
				await queryInterface.bulkInsert('gallery-people', newPeople, options);
			}

			// 2) Eventos (fecha = foto más antigua del evento)
			const eventSlugs = [...new Set(galleryImages.map((image) => image.eventoId))];
			const knownEvents = new Set(
				(await query('SELECT slug FROM "gallery-events"')).map((row) => row.slug),
			);
			const newEvents = eventSlugs
				.filter((slug) => !knownEvents.has(slug))
				.map((slug) => {
					const images = galleryImages.filter((image) => image.eventoId === slug);
					const config = EVENTS[slug] ?? { title: humanize(slug) };
					const cover = config.cover
						? images.find((image) => image.url.endsWith(`/${config.cover}`))
						: null;

					return {
						slug,
						title: config.title,
						eventDate: toDate(Math.min(...images.map((image) => image.createdAt))),
						coverUrl: cover?.url ?? null,
						isFeatured: Boolean(config.featured),
						createdAt: now,
						updatedAt: now,
					};
				});
			if (newEvents.length) {
				await queryInterface.bulkInsert('gallery-events', newEvents, options);
			}

			// 3) Imágenes (solo las URLs que aún no existen)
			const eventIds = new Map(
				(await query('SELECT id, slug FROM "gallery-events"')).map((row) => [row.slug, row.id]),
			);
			const knownUrls = new Set(
				(await query('SELECT url FROM "gallery-images"')).map((row) => row.url),
			);
			const rows = galleryImages
				.filter((image) => !knownUrls.has(image.url))
				.map((image) => ({
					url: image.url,
					alt: image.alt,
					category: image.categoriaId,
					eventId: eventIds.get(image.eventoId),
					memberSlugs: image.integranteIds,
					width: image.width,
					height: image.height,
					takenAt: toDate(image.createdAt),
					active: image.active,
					createdAt: now,
					updatedAt: now,
				}));

			for (let start = 0; start < rows.length; start += CHUNK) {
				await queryInterface.bulkInsert(
					'gallery-images',
					rows.slice(start, start + CHUNK),
					options,
					{ memberSlugs: { type: Sequelize.ARRAY(Sequelize.TEXT) } },
				);
			}
		});
	},

	async down(queryInterface, Sequelize) {
		const { Op } = Sequelize;

		await queryInterface.bulkDelete('gallery-images', {
			url: { [Op.in]: galleryImages.map((image) => image.url) },
		});
		// Eventos e integrantes solo si ya no los usa ninguna imagen (p. ej. subidas desde el dashboard)
		await queryInterface.sequelize.query(
			`DELETE FROM "gallery-events" e WHERE e.slug IN (:slugs)
			 AND NOT EXISTS (SELECT 1 FROM "gallery-images" i WHERE i."eventId" = e.id)`,
			{ replacements: { slugs: Object.keys(EVENTS) } },
		);
		await queryInterface.sequelize.query(
			`DELETE FROM "gallery-people" p
			 WHERE NOT EXISTS (SELECT 1 FROM "gallery-images" i WHERE p.slug = ANY(i."memberSlugs"))`,
		);
	},
};
