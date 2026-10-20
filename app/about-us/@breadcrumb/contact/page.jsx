import Breadcrumb from '@/frontend/components/ui/Breadcrumb';
import { aboutCrumbs } from '../../_lib/breadcrumbs';

export default function ContactBreadcrumb() {
	return <Breadcrumb items={aboutCrumbs({ contact: true })} />;
}
