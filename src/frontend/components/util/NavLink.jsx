'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NavLink({
	href,
	children,
	className = '',
	activeClassName = '',
}) {
	const pathname = usePathname();
	const isActive = pathname === href;

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
