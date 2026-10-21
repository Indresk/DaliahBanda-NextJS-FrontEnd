import 'server-only';

// Columnas internas que no se exportan: los ids y las claves foráneas cambian entre bases de
// datos (los exports referencian por slug) y las fechas de fila no aportan al seed.
const INTERNAL = new Set(['id', 'albumId', 'songId', 'memberId', 'createdAt', 'updatedAt']);

export const toExportRow = (row) =>
	Object.fromEntries(Object.entries(row).filter(([key]) => !INTERNAL.has(key)));
