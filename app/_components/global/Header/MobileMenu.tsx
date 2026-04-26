'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from '@/components/util/NavLink';
import Button from '@/components/buttons/GeneralButton';
import { useBlockScroll } from '@/hooks/useBlockScroll.js';
import './header.css';
import { navigationLinks } from './Header'; // Importamos los links estáticos

export default function MobileMenu() {
	const [dropdown, setDropdown] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const backgroundPanelRef = useRef<HTMLDivElement>(null);
	const location = usePathname();

	useBlockScroll(dropdown);

	useEffect(() => {
		if (dropdown) manageDropdown();
	}, [location]);

	function manageDropdown() {
		if (dropdown) {
			const panel = panelRef.current;
			if (!panel || !backgroundPanelRef.current) return;

			requestAnimationFrame(() => {
				backgroundPanelRef.current!.style.opacity = '0';
				panel.style.maxHeight = '0px';
			});
			setTimeout(() => {
				setDropdown(false);
			}, 300);
		} else {
			setDropdown(true);
			setTimeout(() => {
				const panel = panelRef.current;
				if (!panel || !backgroundPanelRef.current) return;

				backgroundPanelRef.current!.style.opacity = '1';
				requestAnimationFrame(() => {
					panel.style.maxHeight = panel.scrollHeight + 'px';
				});
			}, 100);
		}
	}

	return (
		<>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				onClick={manageDropdown}
				className={`cursor-pointer md:hidden transition duration-300 ease-in-out ${dropdown ? 'rotate-180' : ''}`}
				width='50'
				height='50'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<path stroke='none' d='M0 0h24v24H0z' fill='none' />
				<path d='M4 11l8 3l8 -3' />
			</svg>

			{/* Dropdown */}
			{dropdown && (
				<div onClick={manageDropdown} className='header-dropdown'>
					<div
						ref={backgroundPanelRef}
						className='backdrop-blur-sm backdrop-brightness-50 transition-opacity duration-500 ease-in-out h-full'
						style={{ opacity: 0 }}>
						<div
							ref={panelRef}
							className='bg-darkgray w-[90vw] m-auto overflow-hidden transition-[max-height] duration-400 ease-in-out max-h-0'>
							<ul className='gap-1 flex flex-col p-4'>
								{navigationLinks.map((item) => (
									<li key={item.link}>
										<NavLink
											href={item.link}
											className={({ isActive }: { isActive: boolean }) =>
												`w-full inline-block tracking-tighter font-headline transition-colors duration-300 ${isActive ? 'text-pink-500 border-b-2' : ''}`
											}>
											{item.title}
										</NavLink>
									</li>
								))}
							</ul>
							<NavLink href='/login'>
								<Button fullWidth>Nuestra comunidad</Button>
							</NavLink>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
