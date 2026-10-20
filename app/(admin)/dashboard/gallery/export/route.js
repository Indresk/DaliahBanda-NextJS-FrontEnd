import GalleryExportService from '@/back/services/galleryExport.service';
import { createExportRoute } from '@/back/utils/exportRoute';

// Descarga la galería completa en JSON para volver a sembrarla (solo admin)
export const GET = createExportRoute('gallery', () => GalleryExportService.build());
