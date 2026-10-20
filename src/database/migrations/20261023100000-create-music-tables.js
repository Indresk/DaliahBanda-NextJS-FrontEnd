'use strict';

const ALBUM_TYPES = ['album', 'ep', 'single'];
const RESOURCE_KINDS = ['stem', 'score', 'lyrics', 'video'];

// Música: álbumes (los sencillos son álbumes de una canción), canciones, enlaces de escucha
// por plataforma (del álbum y de la canción) y recursos de canción (stems, partituras, letra, video)
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const id = {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		};
		const timestamps = {
			createdAt: { allowNull: false, type: Sequelize.DATE },
			updatedAt: { allowNull: false, type: Sequelize.DATE },
		};
		const parent = (table, onDelete = 'CASCADE') => ({
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: table, key: 'id' },
			onUpdate: 'CASCADE',
			onDelete,
		});
		const displayOrder = { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 };

		await queryInterface.createTable('albums', {
			id,
			slug: { type: Sequelize.STRING(80), unique: true, allowNull: false },
			title: { type: Sequelize.STRING(120), allowNull: false },
			type: { type: Sequelize.ENUM(...ALBUM_TYPES), allowNull: false },
			// Frase corta bajo el título
			tagline: { type: Sequelize.STRING(200), allowNull: true },
			// "Sobre el álbum"
			description: { type: Sequelize.TEXT, allowNull: true },
			coverUrl: { type: Sequelize.STRING(500), allowNull: false },
			coverWidth: { type: Sequelize.INTEGER, allowNull: false },
			coverHeight: { type: Sequelize.INTEGER, allowNull: false },
			releasedAt: { type: Sequelize.DATEONLY, allowNull: false },
			active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
			...timestamps,
		});
		// Listado público: activos del más reciente al más antiguo
		await queryInterface.addIndex(
			'albums',
			[
				'active',
				{ name: 'releasedAt', order: 'DESC' },
				{ name: 'id', order: 'DESC' },
			],
			{ name: 'albums_active_released' },
		);

		await queryInterface.createTable('songs', {
			id,
			// RESTRICT: un álbum con canciones no se puede borrar por accidente
			albumId: parent('albums', 'RESTRICT'),
			slug: { type: Sequelize.STRING(80), allowNull: false },
			title: { type: Sequelize.STRING(120), allowNull: false },
			trackNumber: { type: Sequelize.INTEGER, allowNull: false },
			// Si es null se usa la fecha del álbum
			releasedAt: { type: Sequelize.DATEONLY, allowNull: true },
			shortDescription: { type: Sequelize.STRING(300), allowNull: false },
			longDescription: { type: Sequelize.TEXT, allowNull: true },
			// "Temas que trata la canción"
			themes: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: false, defaultValue: [] },
			story: { type: Sequelize.TEXT, allowNull: true },
			acknowledgments: { type: Sequelize.TEXT, allowNull: true },
			// Audio para el reproductor
			audioUrl: { type: Sequelize.STRING(500), allowNull: true },
			// Portada propia (opcional); si falta se usa la del álbum
			coverUrl: { type: Sequelize.STRING(500), allowNull: true },
			coverWidth: { type: Sequelize.INTEGER, allowNull: true },
			coverHeight: { type: Sequelize.INTEGER, allowNull: true },
			// Canción recomendada del inicio
			featured: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
			active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
			...timestamps,
		});
		await queryInterface.addConstraint('songs', {
			type: 'unique',
			fields: ['albumId', 'slug'],
			name: 'songs_album_slug_unique',
		});
		// Pistas de un álbum en orden (también sirve a la FK)
		await queryInterface.addIndex('songs', ['albumId', 'active', 'trackNumber', 'id'], {
			name: 'songs_album_active_track',
		});
		// Sugerencias y canción destacada del inicio
		await queryInterface.addIndex(
			'songs',
			['active', 'featured', { name: 'releasedAt', order: 'DESC' }],
			{ name: 'songs_active_featured_released' },
		);

		for (const [table, parentTable, parentKey] of [
			['album-links', 'albums', 'albumId'],
			['song-links', 'songs', 'songId'],
		]) {
			await queryInterface.createTable(table, {
				id,
				[parentKey]: parent(parentTable),
				platform: { type: Sequelize.STRING(30), allowNull: false },
				url: { type: Sequelize.STRING(500), allowNull: false },
				displayOrder,
				...timestamps,
			});
			// Un enlace por plataforma; el índice único también sirve a la FK
			await queryInterface.addConstraint(table, {
				type: 'unique',
				fields: [parentKey, 'platform'],
				name: `${table.replace('-', '_')}_platform_unique`,
			});
		}

		await queryInterface.createTable('song-resources', {
			id,
			songId: parent('songs'),
			kind: { type: Sequelize.ENUM(...RESOURCE_KINDS), allowNull: false },
			label: { type: Sequelize.STRING(120), allowNull: false },
			// Los stems se agrupan por instrumento
			instrument: { type: Sequelize.STRING(80), allowNull: true },
			url: { type: Sequelize.STRING(500), allowNull: false },
			displayOrder,
			...timestamps,
		});
		await queryInterface.addIndex('song-resources', ['songId', 'kind', 'displayOrder', 'id'], {
			name: 'song_resources_song_kind_order',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('song-resources');
		await queryInterface.dropTable('song-links');
		await queryInterface.dropTable('album-links');
		await queryInterface.dropTable('songs');
		await queryInterface.dropTable('albums');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_song-resources_kind"');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_albums_type"');
	},
};
