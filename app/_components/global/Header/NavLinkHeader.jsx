'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NavLinkHeader({ href, children }) {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			className={`w-full inline-block tracking-tighter font-headline transition-colors duration-300 ${isActive ? ' text-pink-500 border-b-2' : ''}`}>
			{children}
		</Link>
	);
}
