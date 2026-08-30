import Button from '@/frontend/components/buttons/GeneralButton';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='flex flex-wrap items-center justify-center gap-4 min-h-full px-10'>
			<picture className='basis-30 order-2 md:order-1'>
				<Image
					width={763.92}
					height={763.92}
					className='invert'
					src='https://assets.daliahbanda.com/brand/logos/icon/logo-d-daliah-vector-v1.svg'
					alt='Logo de Daliah Banda'
				/>
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
