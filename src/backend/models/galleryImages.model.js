import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { GALLERY_CATEGORIES } from '../../shared/constants';
import GalleryEvent from './galleryEvents.model';

const GalleryImage = sequelize.define(
	'gallery-images',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		url: { type: DataTypes.STRING(500), unique: true, allowNull: false },
		alt: { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
		category: {
			type: DataTypes.ENUM(Object.values(GALLERY_CATEGORIES)),
			allowNull: false,
		},
		eventId: { type: DataTypes.INTEGER, allowNull: false },
		memberSlugs: {
			type: DataTypes.ARRAY(DataTypes.TEXT),
			allowNull: false,
			defaultValue: [],
		},
		width: { type: DataTypes.INTEGER, allowNull: false },
		height: { type: DataTypes.INTEGER, allowNull: false },
		takenAt: { type: DataTypes.DATEONLY, allowNull: false },
		active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	},
	{ tableName: 'gallery-images' },
);

GalleryImage.belongsTo(GalleryEvent, {
	foreignKey: 'eventId',
	as: 'event',
	onDelete: 'RESTRICT',
});
GalleryEvent.hasMany(GalleryImage, { foreignKey: 'eventId', as: 'images' });

export default GalleryImage;
