import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const KickCredentials = sequelize.define(
	'kick-credentials',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		refreshToken: { type: DataTypes.TEXT, allowNull: false },
		accessToken: { type: DataTypes.TEXT, allowNull: true },
		accessTokenExpiresAt: { type: DataTypes.DATE, allowNull: true },
		scope: { type: DataTypes.STRING, allowNull: true },
	},
	{ tableName: 'kick-credentials' },
);

export default KickCredentials;
