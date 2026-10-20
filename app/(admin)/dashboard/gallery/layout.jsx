import PageTitle from '@/frontend/components/ui/PageTitle';
import GalleryTabs from './_components/GalleryTabs';

export const metadata = { title: 'Galería' };

export default function GalleryAdminLayout({ children }) {
	return (
		<>
			<PageTitle
				title='Galería'
				description='Imágenes de la galería pública: se pueden añadir, editar, activar y eliminar, una a una o en lote.'
			/>
			<GalleryTabs />
			{children}
		</>
	);
}
