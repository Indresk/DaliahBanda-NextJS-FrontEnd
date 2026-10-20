import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { flyerChangesSchema, flyerSchema } from '../../shared/schemas';
import FlyersRepository from '../repositories/flyers.reposity';
import successResponseWrapper from '../utils/successResponseWrapper';
import { parseOrThrow } from '../utils/validate';

class FlyersService {
	static async findAll() {
		return await FlyersRepository.findAll();
	}

	// Sitio público: solo los activos, en orden
	static async findActive() {
		return await FlyersRepository.findAll({ onlyActive: true });
	}

	static async create(input) {
		const flyer = parseOrThrow(flyerSchema, input);
		const created = await FlyersRepository.create(flyer);

		return successResponseWrapper(created, 'Flyer creado');
	}

	static async update(id, input) {
		const changes = parseOrThrow(flyerChangesSchema, input);
		const updated = await FlyersRepository.update(id, changes);
		if (!updated) throw new AppError(ERROR_CODES.FLYER_NOT_FOUND);

		return successResponseWrapper(updated, 'Flyer actualizado');
	}

	static async delete(id) {
		if (!(await FlyersRepository.delete(id))) {
			throw new AppError(ERROR_CODES.FLYER_NOT_FOUND);
		}
		return successResponseWrapper({ id }, 'Flyer eliminado');
	}

	// Datos portables para volver a sembrar (ver seeders-manual/flyers.js)
	static async exportData() {
		const flyers = await FlyersRepository.findAll();
		return { flyers: flyers.map(({ url, alt, displayOrder, active }) => ({ url, alt, displayOrder, active })) };
	}
}

export default FlyersService;
