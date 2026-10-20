import NavLink from '@/frontend/components/util/NavLink';
import Button from '@/frontend/components/buttons/GeneralButton';
import Link from 'next/link';
import DaliahLogo from '@/frontend/assets/svg/DaliahLogo';
import MobileMenu from './MobileMenu';
import LiveBanner from './LiveBanner';
import { navigationLinks } from './navigationLinks';
import { getLiveStatus } from '@/back/services/liveStatus.cache';
import './header.css';

export default async function Header() {
	const { isLive } = await getLiveStatus();

	return (
		<header className='main-header bg-black z-30'>
			{isLive && <LiveBanner />}

			<section className='px-4 sm:px-6 lg:px-10 relative py-6'>
				<nav className='flex gap-4 justify-between items-center relative'>
					<div className='basis-40'>
						<Link href='/' className='flex items-end w-10'>
							<DaliahLogo />
							<span className='flex flex-col text-base/3 tracking-tighter font-headline'>
								'aliah<small className='text-[10px] text-end'>banda</small>
							</span>
						</Link>
					</div>

					{/* LARGE */}
					<ul className='gap-4 hidden md:flex items-center'>
						{navigationLinks.map((item) => (
							<li key={item.link}>
								<NavLink
									href={item.link}
									className='w-full inline-block tracking-tighter font-headline transition-colors duration-300'
									activeClassName='text-pink-500 border-b-2'>
									{item.title}
								</NavLink>
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
