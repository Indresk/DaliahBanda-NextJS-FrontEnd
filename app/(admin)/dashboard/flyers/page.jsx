import { requirePageRole } from '@/back/utils/sessionGuard';
import FlyersService from '@/back/services/flyers.service';
import { USER_ROLES } from '@/shared/constants';
import PageTitle from '@/frontend/components/ui/PageTitle';
import FlyersManager from './_components/FlyersManager';

export const metadata = { title: 'Flyers' };

export default async function FlyersPage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const flyers = await FlyersService.findAll();

	return (
		<>
			<PageTitle
				title='Flyers'
				description='Carrusel "Trayectoria y presentaciones" del inicio. Se muestran los activos, de menor a mayor orden.'
			/>
			<FlyersManager flyers={flyers} />
		</>
	);
}
