import FlyersService from '@/back/services/flyers.service';
import { createExportRoute } from '@/back/utils/exportRoute';

// Descarga los flyers en JSON para volver a sembrarlos (solo admin)
export const GET = createExportRoute('flyers', () => FlyersService.exportData());
