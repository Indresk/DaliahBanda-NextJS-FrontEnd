import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const Flyer = sequelize.define(
	'flyers',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		url: { type: DataTypes.STRING(500), unique: true, allowNull: false },
		alt: { type: DataTypes.STRING(500), allowNull: false },
		displayOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
	},
	{ tableName: 'flyers' },
);

export default Flyer;
