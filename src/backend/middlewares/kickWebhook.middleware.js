import 'server-only';

import AppError from '../errors/app.error';
import { ERROR_CODES } from '../../shared/errors/error.codes';
import { kickTimestampSchema } from '../../shared/schemas';
import KickWebhookKeyService from '../services/kickWebhookKey.service';
import { isKickSignatureValid } from '../utils/kickSignature';
import { parseOrThrow } from '../utils/validate';

const MAX_BODY_BYTES = 64 * 1024;

// Autentica un webhook de Kick por su firma y devuelve el evento ya leído.
// Lanza AppError (401 firma inválida, 400 cuerpo inválido).
export default async function verifyKickWebhook(request) {
	const signature = request.headers.get('kick-event-signature');
	const messageId = request.headers.get('kick-event-message-id');
	const timestamp = request.headers.get('kick-event-message-timestamp');
	const eventType = request.headers.get('kick-event-type');

	if (!signature || !messageId || !timestamp) {
		throw new AppError(ERROR_CODES.INVALID_WEBHOOK_SIGNATURE);
	}

	const rawBody = await request.text();
	if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) {
		throw new AppError(ERROR_CODES.BAD_REQUEST, 'Cuerpo demasiado grande.');
	}

	const params = { signature, messageId, timestamp, rawBody };
	let valid = isKickSignatureValid({
		...params,
		publicKey: await KickWebhookKeyService.get(),
	});

	// Si Kick rotó la llave, la firma falla con la guardada: se pide de nuevo una vez
	if (!valid) {
		valid = isKickSignatureValid({
			...params,
			publicKey: await KickWebhookKeyService.refresh(),
		});
	}
	if (!valid) throw new AppError(ERROR_CODES.INVALID_WEBHOOK_SIGNATURE);

	let payload;
	try {
		payload = JSON.parse(rawBody);
	} catch {
		throw new AppError(ERROR_CODES.BAD_REQUEST, 'Cuerpo inválido.');
	}

	return {
		payload,
		messageId,
		eventType,
		eventAt: parseOrThrow(kickTimestampSchema, timestamp),
	};
}
