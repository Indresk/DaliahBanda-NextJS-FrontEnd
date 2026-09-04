import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const AllowedEmails = sequelize.define('allowed-emails', {
	email: { type: DataTypes.STRING, unique: true, allowNull: false },
});

export default AllowedEmails;
