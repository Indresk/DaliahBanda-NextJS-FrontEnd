import MusicService from '@/back/services/music.service';
import { createExportRoute } from '@/back/utils/exportRoute';

// Descarga el catálogo (álbumes, canciones, enlaces y recursos) en JSON para volver a sembrarlo (solo admin)
export const GET = createExportRoute('music', () => MusicService.exportData());
