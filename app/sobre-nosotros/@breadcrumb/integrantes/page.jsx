import Breadcrumb from '@/frontend/components/ui/Breadcrumb';
import { aboutCrumbs } from '../../_lib/breadcrumbs';

export default function MembersBreadcrumb() {
	return <Breadcrumb items={aboutCrumbs({ members: true })} />;
}
