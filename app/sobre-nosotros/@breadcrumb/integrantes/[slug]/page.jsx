import { getMember } from '@/back/services/members.cache';
import Breadcrumb from '@/frontend/components/ui/Breadcrumb';
import { aboutCrumbs } from '../../../_lib/breadcrumbs';

export default async function MemberBreadcrumb({ params }) {
	const { slug } = await params;
	const member = await getMember(slug);
	if (!member) return null;

	return <Breadcrumb items={aboutCrumbs({ member })} />;
}
