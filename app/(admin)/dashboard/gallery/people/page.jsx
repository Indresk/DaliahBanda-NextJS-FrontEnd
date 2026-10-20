import { requirePageRole } from '@/back/utils/sessionGuard';
import GalleryPeopleService from '@/back/services/galleryPeople.service';
import { USER_ROLES } from '@/shared/constants';
import PeopleManager from '../_components/PeopleManager';

export const metadata = { title: 'Integrantes de la galería' };

export default async function GalleryPeoplePage() {
	await requirePageRole([USER_ROLES.ADMIN]);
	const people = await GalleryPeopleService.findAll();

	return <PeopleManager people={people} />;
}
