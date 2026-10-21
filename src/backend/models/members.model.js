import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { MEMBER_LINK_KINDS } from '../../shared/constants';

const id = { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true };
const displayOrder = { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 };

export const Member = sequelize.define(
	'members',
	{
		id,
		slug: { type: DataTypes.STRING(80), unique: true, allowNull: false },
		name: { type: DataTypes.STRING(80), allowNull: false },
		instrument: { type: DataTypes.STRING(80), allowNull: false },
		shortBio: { type: DataTypes.STRING(300), allowNull: false },
		longBio: { type: DataTypes.TEXT, allowNull: true },
		featuredUrl: { type: DataTypes.STRING(500), allowNull: false },
		featuredWidth: { type: DataTypes.INTEGER, allowNull: false },
		featuredHeight: { type: DataTypes.INTEGER, allowNull: false },
		featuredAlt: { type: DataTypes.STRING(500), allowNull: true },
		displayOrder,
		active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	},
	{ tableName: 'members' },
);

export const MemberLink = sequelize.define(
	'member-links',
	{
		id,
		memberId: { type: DataTypes.INTEGER, allowNull: false },
		kind: { type: DataTypes.ENUM(Object.values(MEMBER_LINK_KINDS)), allowNull: false },
		label: { type: DataTypes.STRING(80), allowNull: false },
		url: { type: DataTypes.STRING(500), allowNull: false },
		displayOrder,
	},
	{ tableName: 'member-links' },
);

export const MemberImage = sequelize.define(
	'member-images',
	{
		id,
		memberId: { type: DataTypes.INTEGER, allowNull: false },
		url: { type: DataTypes.STRING(500), allowNull: false },
		alt: { type: DataTypes.STRING(500), allowNull: false },
		width: { type: DataTypes.INTEGER, allowNull: false },
		height: { type: DataTypes.INTEGER, allowNull: false },
		displayOrder,
	},
	{ tableName: 'member-images' },
);

Member.hasMany(MemberLink, { foreignKey: 'memberId', as: 'links', onDelete: 'CASCADE' });
Member.hasMany(MemberImage, { foreignKey: 'memberId', as: 'images', onDelete: 'CASCADE' });
MemberLink.belongsTo(Member, { foreignKey: 'memberId' });
MemberImage.belongsTo(Member, { foreignKey: 'memberId' });

export default Member;
