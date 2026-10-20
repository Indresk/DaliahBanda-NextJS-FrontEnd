'use strict';

const CATEGORIES = ['live', 'backstage'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('gallery-images', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			// URL completa (no depende del bucket: puede ser cualquier imagen https)
			url: { type: Sequelize.STRING(500), unique: true, allowNull: false },
			alt: { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
			category: { type: Sequelize.ENUM(...CATEGORIES), allowNull: false },
			eventId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'gallery-events', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			// Slugs de gallery-people. Arreglo (no tabla puente): una sola tabla para filtrar
			// y editar en lote; se valida contra gallery-people y se indexa con GIN.
			memberSlugs: {
				type: Sequelize.ARRAY(Sequelize.TEXT),
				allowNull: false,
				defaultValue: [],
			},
			width: { type: Sequelize.INTEGER, allowNull: false },
			height: { type: Sequelize.INTEGER, allowNull: false },
			// Fecha de la foto (ordena la galería). No confundir con createdAt de la fila.
			takenAt: { type: Sequelize.DATEONLY, allowNull: false },
			active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
			createdAt: { allowNull: false, type: Sequelize.DATE },
			updatedAt: { allowNull: false, type: Sequelize.DATE },
		});

		await queryInterface.addConstraint('gallery-images', {
			type: 'check',
			name: 'gallery_images_dimensions_positive',
			fields: ['width'],
			where: { width: { [Sequelize.Op.gt]: 0 }, height: { [Sequelize.Op.gt]: 0 } },
		});

		// Orden de la galería: más reciente primero (takenAt) y desempate por id.
		// Cada índice sirve a un listado paginado por cursor sin ordenar en memoria.
		const order = [
			{ name: 'takenAt', order: 'DESC' },
			{ name: 'id', order: 'DESC' },
		];
		await queryInterface.addIndex(
			'gallery-images',
			['category', 'active', ...order],
			{ name: 'gallery_images_category_active_taken' },
		);
		await queryInterface.addIndex(
			'gallery-images',
			['eventId', 'active', ...order],
			{ name: 'gallery_images_event_active_taken' },
		);
		await queryInterface.addIndex('gallery-images', ['active', ...order], {
			name: 'gallery_images_active_taken',
		});
		// Listado del dashboard sin filtro de estado (muestra activas e inactivas)
		await queryInterface.addIndex('gallery-images', order, {
			name: 'gallery_images_taken',
		});
		// Filtro por integrante: memberSlugs @> '{silvia}' (todos) o && '{silvia,mike}' (alguno)
		await queryInterface.addIndex('gallery-images', ['memberSlugs'], {
			name: 'gallery_images_members_gin',
			using: 'GIN',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('gallery-images');
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_gallery-images_category"',
		);
	},
};
