import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { Member } from './members.model';

const LineupEntry = sequelize.define(
	'lineup-entries',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		memberId: { type: DataTypes.INTEGER, allowNull: true },
		personName: { type: DataTypes.STRING(120), allowNull: false },
		role: { type: DataTypes.STRING(120), allowNull: false },
		startYear: { type: DataTypes.INTEGER, allowNull: false },
		endYear: { type: DataTypes.INTEGER, allowNull: true },
		note: { type: DataTypes.STRING(300), allowNull: true },
	},
	{ tableName: 'lineup-entries' },
);

LineupEntry.belongsTo(Member, { foreignKey: 'memberId', as: 'member', onDelete: 'SET NULL' });

export default LineupEntry;
