import 'server-only';

import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { ARTICLE_STATUS, AUTHOR_KINDS } from '../../shared/constants';
import { Member } from './members.model';

const id = { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true };

export const Article = sequelize.define(
	'articles',
	{
		id,
		slug: { type: DataTypes.STRING(80), unique: true, allowNull: false },
		title: { type: DataTypes.STRING(160), allowNull: false },
		synopsis: { type: DataTypes.STRING(400), allowNull: false },
		content: { type: DataTypes.TEXT, allowNull: true },
		imageUrl: { type: DataTypes.STRING(500), allowNull: false },
		imageWidth: { type: DataTypes.INTEGER, allowNull: false },
		imageHeight: { type: DataTypes.INTEGER, allowNull: false },
		imageAlt: { type: DataTypes.STRING(300), allowNull: false },
		displayDate: { type: DataTypes.DATEONLY, allowNull: false },
		status: {
			type: DataTypes.ENUM(Object.values(ARTICLE_STATUS)),
			allowNull: false,
			defaultValue: ARTICLE_STATUS.DRAFT,
		},
		publishedAt: { type: DataTypes.DATE, allowNull: true },
		readingMinutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
	},
	{ tableName: 'articles' },
);

export const ArticleTag = sequelize.define(
	'article-tags',
	{
		id,
		slug: { type: DataTypes.STRING(80), unique: true, allowNull: false },
		name: { type: DataTypes.STRING(40), allowNull: false },
	},
	{ tableName: 'article-tags' },
);

// Tabla puente (clave primaria compuesta, sin id ni fechas)
export const ArticleTagLink = sequelize.define(
	'article-tag-links',
	{
		articleId: { type: DataTypes.INTEGER, primaryKey: true },
		tagId: { type: DataTypes.INTEGER, primaryKey: true },
	},
	{ tableName: 'article-tag-links', timestamps: false },
);

export const ArticleAuthor = sequelize.define(
	'article-authors',
	{
		id,
		articleId: { type: DataTypes.INTEGER, allowNull: false },
		memberId: { type: DataTypes.INTEGER, allowNull: true },
		name: { type: DataTypes.STRING(120), allowNull: false },
		kind: {
			type: DataTypes.ENUM(Object.values(AUTHOR_KINDS)),
			allowNull: false,
			defaultValue: AUTHOR_KINDS.PERSON,
		},
		displayOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
	},
	{ tableName: 'article-authors' },
);

// Todas las asociaciones entre estos modelos van en este archivo: así se recargan juntas en desarrollo
Article.belongsToMany(ArticleTag, {
	through: ArticleTagLink,
	foreignKey: 'articleId',
	otherKey: 'tagId',
	as: 'tags',
});
ArticleTag.belongsToMany(Article, {
	through: ArticleTagLink,
	foreignKey: 'tagId',
	otherKey: 'articleId',
	as: 'articles',
});
Article.hasMany(ArticleAuthor, { foreignKey: 'articleId', as: 'authors', onDelete: 'CASCADE' });
ArticleAuthor.belongsTo(Article, { foreignKey: 'articleId' });
// Solo se declara el lado de ArticleAuthor (modelo de este archivo) hacia Member (de otro archivo)
ArticleAuthor.belongsTo(Member, { foreignKey: 'memberId', as: 'member', onDelete: 'SET NULL' });

export default Article;
