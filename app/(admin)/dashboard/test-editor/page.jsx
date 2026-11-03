import { requirePageRole } from '@/back/utils/sessionGuard';
import { USER_ROLES } from '@/shared/constants';
import PageTitle from '@/frontend/components/ui/PageTitle';
import TestEditorDemo from './_components/TestEditorDemo';

export const metadata = { title: 'Prueba del editor' };

// Página de prueba del editor de texto enriquecido (no está en el menú del dashboard). Es el mismo
// editor del campo "Contenido de la canción" de la ficha de canción.
export default async function TestEditorPage() {
	await requirePageRole([USER_ROLES.ADMIN]);

	return (
		<>
			<PageTitle
				title='Prueba del editor'
				description='Escribe en el editor y mira abajo el HTML que se guardaría y cómo se vería con los estilos globales del sitio (clase rich-text).'
			/>
			<TestEditorDemo />
		</>
	);
}
