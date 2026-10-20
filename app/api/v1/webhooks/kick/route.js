import { NextResponse } from 'next/server';
import verifyKickWebhook from '@/back/middlewares/kickWebhook.middleware';
import { errorMiddleware } from '@/back/middlewares/error.middleware';
import KickWebhookService from '@/back/services/kickWebhook.service';
import { invalidateLiveStatus } from '@/back/services/liveStatus.cache';

// Kick no envía API key: la autenticidad se comprueba con la firma (verifyKickWebhook).
// Responder 2xx rápido importa: Kick reintenta y puede dar de baja la suscripción si falla.
export async function POST(request) {
	try {
		const event = await verifyKickWebhook(request);
		const result = await KickWebhookService.handleEvent(event);

		// Solo un evento nuevo cambia el estado: se invalida la caché de las páginas públicas
		if (result === 'applied') invalidateLiveStatus();

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		return errorMiddleware(error);
	}
}
