import { NextResponse } from 'next/server';
import { USER_ROLES } from '@/shared/constants';
import { errorMiddleware } from '@/back/middlewares/error.middleware';
import SubscribeEmailsService from '@/back/services/subscribeEmails.service';
import { toCsv } from '@/back/utils/csv';
import { requireRole } from '@/back/utils/sessionGuard';

// Descarga los suscriptores activos en CSV (solo admin)
export async function GET() {
	try {
		await requireRole([USER_ROLES.ADMIN]);

		const subscribers = (await SubscribeEmailsService.findAll()).filter(
			(item) => item.isActive,
		);
		const csv = toCsv([
			['email', 'registrado'],
			...subscribers.map((item) => [
				item.email,
				new Date(item.createdAt).toISOString(),
			]),
		]);
		const date = new Date().toISOString().slice(0, 10);

		return new NextResponse(csv, {
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="suscriptores-${date}.csv"`,
				'Cache-Control': 'no-store',
			},
		});
	} catch (error) {
		return errorMiddleware(error);
	}
}
