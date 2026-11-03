import ArticlesService from '@/back/services/articles.service';
import { createExportRoute } from '@/back/utils/exportRoute';

// Descarga los artículos (con etiquetas y autores) en JSON para volver a sembrarlos (solo admin)
export const GET = createExportRoute('articles', () => ArticlesService.exportData());
