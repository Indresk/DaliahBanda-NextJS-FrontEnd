'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

type NavLinkProps = {
	href: string;
	children:
		| React.ReactNode
		| ((props: { isActive: boolean }) => React.ReactNode);
	className?: string | ((props: { isActive: boolean }) => string);
};

export default function NavLink({
	href,
	children,
	className = '',
}: NavLinkProps) {
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
