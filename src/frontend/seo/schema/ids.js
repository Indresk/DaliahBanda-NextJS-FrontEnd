import { SITE } from '../site';

// Identificadores (@id) de las entidades del grafo schema.org: así una página puede referirse a
// otra entidad (la banda, un miembro, un álbum) sin repetir sus datos.
export const MUSIC_GROUP_ID = `${SITE.url}/#musicgroup`;
export const memberPersonId = (slug) =>
	`${SITE.url}/sobre-nosotros/integrantes/${slug}#person`;
export const albumSchemaId = (slug) => `${SITE.url}/discografia/${slug}#album`;
export const songSchemaId = (albumSlug, songSlug) =>
	`${SITE.url}/discografia/${albumSlug}/${songSlug}#recording`;
export const articleSchemaId = (slug) => `${SITE.url}/manifiestos/${slug}#article`;
