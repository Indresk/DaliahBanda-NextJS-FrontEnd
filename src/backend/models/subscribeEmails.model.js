import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import User from './users.model';

const SubscribeEmail = sequelize.define('subscribe-emails', {
	email: { type: DataTypes.STRING, unique: true, allowNull: false },
	userId: { type: DataTypes.INTEGER, allowNull: true },
	isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
	unsubscribeToken: {
		type: DataTypes.UUID,
		unique: true,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
	},
	unsubscribedAt: { type: DataTypes.DATE, allowNull: true },
});

// La relación es opcional: un suscriptor puede no tener usuario registrado
SubscribeEmail.belongsTo(User, {
	foreignKey: 'userId',
	as: 'user',
	onDelete: 'SET NULL',
});
User.hasOne(SubscribeEmail, { foreignKey: 'userId', as: 'subscription' });

export default SubscribeEmail;
