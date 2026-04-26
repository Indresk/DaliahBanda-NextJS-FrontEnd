import NavLink from '@/components/util/NavLink';
import Button from '@/components/buttons/GeneralButton';
import Link from 'next/link';
import Image from 'next/image';
import NavLinkHeader from './NavLinkHeader';
import MobileMenu from './MobileMenu';
// import LiveBannerWrapper from './LiveBannerWrapper'; // El wrapper para el context
import './header.css';

export const navigationLinks = [
	{ title: 'Discografía', link: '/albums' },
	{ title: 'Galería', link: '/gallery' },
	{ title: 'Integrantes', link: '/about-us/members' },
];

async function getLiveStatus() {
	const res = await fetch('https://back.daliahbanda.com/status', {
		next: { revalidate: 60 },
	}); // Revalida cada minuto
	return res.json();
}

export default function Header() {
	return (
		<header className='main-header bg-black z-30'>
			{/* El banner interactivo aislado */}
			{/* <LiveBannerWrapper /> */}

			<section className='px-4 sm:px-6 lg:px-10 relative py-6'>
				<nav className='flex gap-4 justify-between items-center relative'>
					<div className='basis-40'>
						<Link href='/' className='flex items-end w-10'>
							<Image
								width={763.92}
								height={763.92}
								className='invert'
								src='https://assets.daliahbanda.com/brand/logos/icon/logo-d-daliah-vector-v1.svg'
								alt='Logo de Daliah Banda'
							/>
							<span className='flex flex-col text-base/3 tracking-tighter font-headline'>
								'aliah<small className='text-[10px] text-end'>banda</small>
							</span>
						</Link>
					</div>

					{/* LARGE */}
					<ul className='gap-4 hidden md:flex items-center'>
						{navigationLinks.map((item) => (
							<li key={item.link}>
								<NavLinkHeader href={item.link}>{item.title}</NavLinkHeader>
							</li>
						))}
					</ul>

					<div className='flex gap-4 items-center'>
						{/* SMALL */}
						<MobileMenu />

						<NavLink href='/login' className='hidden md:flex'>
							<Button size='sm'>Nuestra comunidad</Button>
						</NavLink>
					</div>
				</nav>
			</section>
		</header>
	);
}
