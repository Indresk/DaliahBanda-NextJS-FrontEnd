import Breadcrumb from '@/frontend/components/ui/Breadcrumb';
import { aboutCrumbs } from '../../_lib/breadcrumbs';

export default function ComunityBreadcrumb() {
	return <Breadcrumb items={aboutCrumbs({ comunity: true })} />;
}
