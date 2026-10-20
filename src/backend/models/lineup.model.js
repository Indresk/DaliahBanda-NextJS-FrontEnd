import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { LINEUP_ROLES } from '../../shared/constants';
import { Member } from './members.model';

const LineupEntry = sequelize.define(
	'lineup-entries',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		memberId: { type: DataTypes.INTEGER, allowNull: true },
		personName: { type: DataTypes.STRING(120), allowNull: false },
		role: { type: DataTypes.ENUM(Object.keys(LINEUP_ROLES)), allowNull: false },
		startYear: { type: DataTypes.INTEGER, allowNull: false },
		startMonth: { type: DataTypes.INTEGER, allowNull: true },
		endYear: { type: DataTypes.INTEGER, allowNull: true },
		endMonth: { type: DataTypes.INTEGER, allowNull: true },
		note: { type: DataTypes.STRING(300), allowNull: true },
	},
	{ tableName: 'lineup-entries' },
);

LineupEntry.belongsTo(Member, { foreignKey: 'memberId', as: 'member', onDelete: 'SET NULL' });

export default LineupEntry;
