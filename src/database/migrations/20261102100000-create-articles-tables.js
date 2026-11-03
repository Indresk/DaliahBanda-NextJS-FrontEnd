'use strict';

const STATUSES = ['draft', 'published'];
const AUTHOR_KINDS = ['person', 'organization'];

// Artículos ("manifiestos"): artículo, etiquetas (con tabla puente) y autores (miembro o texto libre)
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
		const article = {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'articles', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		};

		await queryInterface.createTable('articles', {
			id,
			slug: { type: Sequelize.STRING(80), unique: true, allowNull: false },
			title: { type: Sequelize.STRING(160), allowNull: false },
			// Descripción: meta description, listas y redes sociales
			synopsis: { type: Sequelize.STRING(400), allowNull: false },
			// HTML del editor de texto enriquecido; puede estar vacío en un borrador
			content: { type: Sequelize.TEXT, allowNull: true },
			// Imagen principal: masthead y miniatura (el recorte lo hace la página con un ratio fijo)
			imageUrl: { type: Sequelize.STRING(500), allowNull: false },
			imageWidth: { type: Sequelize.INTEGER, allowNull: false },
			imageHeight: { type: Sequelize.INTEGER, allowNull: false },
			imageAlt: { type: Sequelize.STRING(300), allowNull: false },
			// Fecha que ve el público (editable)
			displayDate: { type: Sequelize.DATEONLY, allowNull: false },
			status: { type: Sequelize.ENUM(...STATUSES), allowNull: false, defaultValue: 'draft' },
			// Momento real de la primera publicación: ordena el listado y los botones anterior/siguiente
			publishedAt: { type: Sequelize.DATE, allowNull: true },
			// Calculado al guardar a partir del contenido (así las listas no cargan el HTML)
			readingMinutes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
			...timestamps,
		});
		await queryInterface.addConstraint('articles', {
			type: 'check',
			name: 'articles_published_has_date',
			fields: ['status'],
			where: {
				[Sequelize.Op.or]: [{ status: 'draft' }, { publishedAt: { [Sequelize.Op.ne]: null } }],
			},
		});
		// Listado público y anterior/siguiente: publicados del más reciente al más antiguo
		await queryInterface.addIndex(
			'articles',
			[
				'status',
				{ name: 'publishedAt', order: 'DESC' },
				{ name: 'id', order: 'DESC' },
			],
			{ name: 'articles_status_published' },
		);

		await queryInterface.createTable('article-tags', {
			id,
			slug: { type: Sequelize.STRING(80), unique: true, allowNull: false },
			name: { type: Sequelize.STRING(40), allowNull: false },
			...timestamps,
		});

		await queryInterface.createTable('article-tag-links', {
			articleId: { ...article, primaryKey: true },
			tagId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: { model: 'article-tags', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
		});
		// Artículos de una etiqueta (la clave primaria sirve a la búsqueda por artículo)
		await queryInterface.addIndex('article-tag-links', ['tagId', 'articleId'], {
			name: 'article_tag_links_tag_article',
		});

		await queryInterface.createTable('article-authors', {
			id,
			articleId: article,
			// Opcional: si el autor es un miembro se enlaza a su página; al borrar el miembro queda el nombre
			memberId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: { model: 'members', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
			// Siempre se guarda un nombre (el del miembro al guardar, o el escrito a mano)
			name: { type: Sequelize.STRING(120), allowNull: false },
			kind: { type: Sequelize.ENUM(...AUTHOR_KINDS), allowNull: false, defaultValue: 'person' },
			displayOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
			...timestamps,
		});
		await queryInterface.addIndex('article-authors', ['articleId', 'displayOrder', 'id'], {
			name: 'article_authors_article_order',
		});
		await queryInterface.addIndex('article-authors', ['memberId'], {
			name: 'article_authors_member',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('article-authors');
		await queryInterface.dropTable('article-tag-links');
		await queryInterface.dropTable('article-tags');
		await queryInterface.dropTable('articles');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_article-authors_kind"');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_articles_status"');
	},
};
