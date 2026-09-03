import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { USER_ROLES } from '../../shared/constants';

const User = sequelize.define('users', {
	googleId: {
		type: DataTypes.UUID,
		allowNull: true,
		unique: true,
	},
	email: { type: DataTypes.STRING, unique: true, allowNull: false },
	role: {
		type: DataTypes.ENUM(Object.values(USER_ROLES)),
		allowNull: false,
		defaultValue: USER_ROLES.USER,
	},
});

export default User;
