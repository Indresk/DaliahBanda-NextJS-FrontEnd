import Breadcrumb from '@/frontend/components/ui/Breadcrumb';
import { albumsCrumbs } from '../_lib/breadcrumbs';

export default function AlbumsBreadcrumb() {
	return <Breadcrumb items={albumsCrumbs()} />;
}
