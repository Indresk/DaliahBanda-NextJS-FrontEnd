import { requirePageRole } from '@/back/utils/sessionGuard';
import { DASHBOARD_ROLES } from '@/shared/constants';
import { SignOutButton } from '@/front/components/buttons/AuthButtons';
import DashboardNav from './_components/DashboardNav';
import { DASHBOARD_SECTIONS } from './_lib/sections';

export const metadata = {
	title: 'Dashboard',
	robots: { index: false, follow: false },
};

// Este layout no se vuelve a ejecutar al navegar entre secciones: cada página comprueba su rol.
export default async function DashboardLayout({ children }) {
	const user = await requirePageRole(DASHBOARD_ROLES);
	const sections = DASHBOARD_SECTIONS.filter((section) =>
		section.roles.includes(user.role),
	);

	return (
		<div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:px-8'>
			<aside className='flex shrink-0 flex-col gap-6 md:w-60'>
				<div>
					<p className='truncate text-sm' title={user.email}>
						{user.email}
					</p>
					<p className='font-headline text-xs uppercase tracking-wider text-primary-light'>
						{user.role}
					</p>
				</div>
				<DashboardNav sections={sections} />
				<SignOutButton variant='secondary' size='sm' />
			</aside>
			<div className='min-w-0 flex-1'>{children}</div>
		</div>
	);
}
