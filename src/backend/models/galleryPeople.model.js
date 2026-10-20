import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const GalleryPerson = sequelize.define(
	'gallery-people',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		slug: { type: DataTypes.STRING(80), unique: true, allowNull: false },
		name: { type: DataTypes.STRING(80), allowNull: false },
		isMember: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	},
	{ tableName: 'gallery-people' },
);

export default GalleryPerson;
