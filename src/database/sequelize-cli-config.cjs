if (process.env.NODE_ENV !== 'production') {
	try {
		require('dotenv').config();
	} catch (e) {}
}

module.exports = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT || 5432,
		dialect: 'postgres',
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT || 5432,
		dialect: 'postgres',
	},
};
