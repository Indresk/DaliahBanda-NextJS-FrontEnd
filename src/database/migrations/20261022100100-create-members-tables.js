'use strict';

const LINK_KINDS = ['contact', 'project'];

// Una página personal por miembro: datos propios, enlaces e imágenes de apoyo
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
		const memberId = {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: 'members', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		};

		await queryInterface.createTable('members', {
			id,
			slug: { type: Sequelize.STRING(80), unique: true, allowNull: false },
			name: { type: Sequelize.STRING(80), allowNull: false },
			instrument: { type: Sequelize.STRING(80), allowNull: false },
			shortBio: { type: Sequelize.STRING(300), allowNull: false },
			longBio: { type: Sequelize.TEXT, allowNull: true },
			// Imagen principal (la del carrusel de integrantes del home)
			featuredUrl: { type: Sequelize.STRING(500), allowNull: false },
			featuredWidth: { type: Sequelize.INTEGER, allowNull: false },
			featuredHeight: { type: Sequelize.INTEGER, allowNull: false },
			featuredAlt: { type: Sequelize.STRING(500), allowNull: true },
			joinedAt: { type: Sequelize.DATEONLY, allowNull: true },
			displayOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
			// true = integrante actual publicado en el sitio
			active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
			...timestamps,
		});
		await queryInterface.addIndex('members', ['active', 'displayOrder', 'id'], {
			name: 'members_active_order',
		});

		await queryInterface.createTable('member-links', {
			id,
			memberId,
			kind: { type: Sequelize.ENUM(...LINK_KINDS), allowNull: false },
			label: { type: Sequelize.STRING(80), allowNull: false },
			url: { type: Sequelize.STRING(500), allowNull: false },
			displayOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
			...timestamps,
		});
		await queryInterface.addIndex('member-links', ['memberId', 'displayOrder', 'id'], {
			name: 'member_links_member_order',
		});

		await queryInterface.createTable('member-images', {
			id,
			memberId,
			url: { type: Sequelize.STRING(500), allowNull: false },
			alt: { type: Sequelize.STRING(500), allowNull: false },
			width: { type: Sequelize.INTEGER, allowNull: false },
			height: { type: Sequelize.INTEGER, allowNull: false },
			displayOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
			...timestamps,
		});
		await queryInterface.addIndex('member-images', ['memberId', 'displayOrder', 'id'], {
			name: 'member_images_member_order',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('member-images');
		await queryInterface.dropTable('member-links');
		await queryInterface.dropTable('members');
		await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_member-links_kind"');
	},
};
