import LineupService from '@/back/services/lineup.service';
import { createExportRoute } from '@/back/utils/exportRoute';

// Descarga la línea del tiempo de la formación en JSON para volver a sembrarla (solo admin)
export const GET = createExportRoute('lineup', () => LineupService.exportData());
