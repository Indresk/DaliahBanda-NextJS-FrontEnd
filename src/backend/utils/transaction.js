import 'server-only';

import sequelize from '../config/db';

// Ejecuta `work(transaction)` en una transacción: confirma si termina y revierte si lanza.
// Los repositorios reciben `{ transaction }` en el último parámetro `options`.
export const withTransaction = (work) => sequelize.transaction(work);
