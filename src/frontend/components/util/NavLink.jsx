'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NavLink({ href, children, className = '' }) {
	const pathname = usePathname();
	const isActive = pathname === href;

	const resolvedClassName =
		typeof className === 'function' ? className({ isActive }) : className;

	const resolvedChildren =
		typeof children === 'function' ? children({ isActive }) : children;

	return (
		<Link href={href} className={resolvedClassName}>
			{resolvedChildren}
		</Link>
	);
}
