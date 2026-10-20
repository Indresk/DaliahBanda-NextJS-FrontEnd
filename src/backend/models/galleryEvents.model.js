import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const GalleryEvent = sequelize.define(
	'gallery-events',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		slug: { type: DataTypes.STRING(80), unique: true, allowNull: false },
		title: { type: DataTypes.STRING(120), allowNull: false },
		description: { type: DataTypes.TEXT, allowNull: true },
		eventDate: { type: DataTypes.DATEONLY, allowNull: true },
		coverUrl: { type: DataTypes.STRING(500), allowNull: true },
		isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	},
	{ tableName: 'gallery-events' },
);

export default GalleryEvent;
