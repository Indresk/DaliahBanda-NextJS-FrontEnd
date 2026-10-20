import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { ALBUM_TYPES, SONG_RESOURCE_KINDS } from '../../shared/constants';

const id = { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true };
const displayOrder = { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 };
const linkFields = {
	platform: { type: DataTypes.STRING(30), allowNull: false },
	url: { type: DataTypes.STRING(500), allowNull: false },
	displayOrder,
};

export const Album = sequelize.define(
	'albums',
	{
		id,
		slug: { type: DataTypes.STRING(80), unique: true, allowNull: false },
		title: { type: DataTypes.STRING(120), allowNull: false },
		type: { type: DataTypes.ENUM(Object.values(ALBUM_TYPES)), allowNull: false },
		tagline: { type: DataTypes.STRING(200), allowNull: true },
		description: { type: DataTypes.TEXT, allowNull: true },
		coverUrl: { type: DataTypes.STRING(500), allowNull: false },
		coverWidth: { type: DataTypes.INTEGER, allowNull: false },
		coverHeight: { type: DataTypes.INTEGER, allowNull: false },
		releasedAt: { type: DataTypes.DATEONLY, allowNull: false },
		active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	},
	{ tableName: 'albums' },
);

export const Song = sequelize.define(
	'songs',
	{
		id,
		albumId: { type: DataTypes.INTEGER, allowNull: false },
		slug: { type: DataTypes.STRING(80), allowNull: false },
		title: { type: DataTypes.STRING(120), allowNull: false },
		trackNumber: { type: DataTypes.INTEGER, allowNull: false },
		releasedAt: { type: DataTypes.DATEONLY, allowNull: true },
		shortDescription: { type: DataTypes.STRING(300), allowNull: false },
		longDescription: { type: DataTypes.TEXT, allowNull: true },
		themes: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false, defaultValue: [] },
		story: { type: DataTypes.TEXT, allowNull: true },
		acknowledgments: { type: DataTypes.TEXT, allowNull: true },
		audioUrl: { type: DataTypes.STRING(500), allowNull: true },
		coverUrl: { type: DataTypes.STRING(500), allowNull: true },
		coverWidth: { type: DataTypes.INTEGER, allowNull: true },
		coverHeight: { type: DataTypes.INTEGER, allowNull: true },
		featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	},
	{ tableName: 'songs' },
);

export const AlbumLink = sequelize.define(
	'album-links',
	{ id, albumId: { type: DataTypes.INTEGER, allowNull: false }, ...linkFields },
	{ tableName: 'album-links' },
);

export const SongLink = sequelize.define(
	'song-links',
	{ id, songId: { type: DataTypes.INTEGER, allowNull: false }, ...linkFields },
	{ tableName: 'song-links' },
);

export const SongResource = sequelize.define(
	'song-resources',
	{
		id,
		songId: { type: DataTypes.INTEGER, allowNull: false },
		kind: { type: DataTypes.ENUM(Object.values(SONG_RESOURCE_KINDS)), allowNull: false },
		label: { type: DataTypes.STRING(120), allowNull: false },
		instrument: { type: DataTypes.STRING(80), allowNull: true },
		url: { type: DataTypes.STRING(500), allowNull: false },
		displayOrder,
	},
	{ tableName: 'song-resources' },
);

Album.hasMany(Song, { foreignKey: 'albumId', as: 'songs', onDelete: 'RESTRICT' });
Song.belongsTo(Album, { foreignKey: 'albumId', as: 'album' });
Album.hasMany(AlbumLink, { foreignKey: 'albumId', as: 'links', onDelete: 'CASCADE' });
Song.hasMany(SongLink, { foreignKey: 'songId', as: 'links', onDelete: 'CASCADE' });
Song.hasMany(SongResource, { foreignKey: 'songId', as: 'resources', onDelete: 'CASCADE' });
