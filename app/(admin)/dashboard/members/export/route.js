import MembersService from '@/back/services/members.service';
import { createExportRoute } from '@/back/utils/exportRoute';

// Descarga los miembros (con enlaces e imágenes) en JSON para volver a sembrarlos (solo admin)
export const GET = createExportRoute('members', () => MembersService.exportData());
