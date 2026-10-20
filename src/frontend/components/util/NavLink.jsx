'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NavLink({
	href,
	children,
	className = '',
	activeClassName = '',
	// exact=false: también activo en las subrutas (/dashboard/gallery/new activa /dashboard/gallery)
	exact = true,
}) {
	const pathname = usePathname();
	const isActive = exact
		? pathname === href
		: pathname === href || pathname.startsWith(`${href}/`);

	const baseClassName =
		typeof className === 'function' ? className({ isActive }) : className;

	const resolvedClassName = [baseClassName, isActive && activeClassName]
		.filter(Boolean)
		.join(' ');

	const resolvedChildren =
		typeof children === 'function' ? children({ isActive }) : children;

	return (
		<Link href={href} className={resolvedClassName}>
			{resolvedChildren}
		</Link>
	);
}
