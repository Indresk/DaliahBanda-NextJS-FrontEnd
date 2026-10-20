import Breadcrumb from '@/frontend/components/ui/Breadcrumb';
import { aboutCrumbs } from '../_lib/breadcrumbs';

export default function AboutBreadcrumb() {
	return <Breadcrumb items={aboutCrumbs()} />;
}
