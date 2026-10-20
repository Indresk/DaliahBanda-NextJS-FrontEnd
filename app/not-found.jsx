import Button from '@/frontend/components/buttons/GeneralButton';
import DaliahLogo from '@/frontend/assets/svg/DaliahLogo';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='flex flex-wrap items-center justify-center gap-4 min-h-full px-10'>
			<picture className='basis-30 order-2 md:order-1'>
				<DaliahLogo />
			</picture>
			<div className='order-1 md:order-2'>
				<div>
					<h1 className='text-4xl md:text-6xl lg:text-8xl uppercase '>
						404 <br />
					</h1>
					<h2>
						<strong>Página no encontrada...</strong>
					</h2>
				</div>
				<Link href='/'>
					<Button variant='textLink' size='noPadding' rigthArrow>
						Volver al inicio
					</Button>
				</Link>
			</div>
		</div>
	);
}
