import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const StreamStatus = sequelize.define(
	'stream-status',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		isLive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		title: { type: DataTypes.STRING, allowNull: true },
		startedAt: { type: DataTypes.DATE, allowNull: true },
		endedAt: { type: DataTypes.DATE, allowNull: true },
		lastEventId: { type: DataTypes.STRING, allowNull: true },
		lastEventAt: { type: DataTypes.DATE, allowNull: true },
	},
	{ tableName: 'stream-status' },
);

export default StreamStatus;
