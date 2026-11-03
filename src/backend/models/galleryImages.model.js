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

// Solo se declara este lado: la asociación se añade al modelo de la imagen, que es el que este archivo
// crea. Declarar también `GalleryEvent.hasMany(GalleryImage, ...)` añadiría un alias a un modelo definido
// en OTRO archivo: al recargar en caliente solo este archivo, el alias se duplicaba y fallaba con
// "You have used the alias images in two separate associations". (Esa asociación nunca se usaba: los
// eventos cuentan sus imágenes con SQL, ver GalleryEventsRepository.listWithStats.)
GalleryImage.belongsTo(GalleryEvent, {
	foreignKey: 'eventId',
	as: 'event',
	onDelete: 'RESTRICT',
});

export default GalleryImage;
