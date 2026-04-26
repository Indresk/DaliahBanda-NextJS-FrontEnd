import Link from 'next/link';
import Button from '@/components/buttons/GeneralButton';
import Image from 'next/image';

export default function LiveCard({ className, ...props }) {
	return (
		<section className={`bg-primary px-8 py-14 ${className}`} {...props}>
			<article className='flex flex-col gap-6 h-full'>
				<figure>
					<Image
						width={1440}
						height={1440}
						className='aspect-4/3'
						src='https://assets.daliahbanda.com/images/live/unal/show-randb3/unal-portada2-v1.jpg'
						alt='Daliah Banda transmitiendo ensayo en vivo de metalcore desde Bogotá'
						loading='lazy'
					/>
				</figure>
				<header className='flex flex-col gap-6 justify-between h-full'>
					<h3 className='tracking-tighter font-headline uppercase font-bold text-2xl'>
						Daliah Banda: En vivo
					</h3>
					<p className='text-sm'>
						{'Accede a nuestro streaming oficial vía '}
						<a
							className='underline'
							href='https://kick.com/daliahbanda'
							target='_blank'
							rel='noopener noreferrer'>
							Kick
						</a>
						{
							' y conoce nuestro proceso creativo, los arreglos en tiempo real y la energía de la banda durante nuestras sesiones de ensayo.'
						}
					</p>
					<Link href='/live' title='Ver a Daliah Banda en vivo'>
						<Button variant='invert' fullWidth>
							Ver ensayo en vivo
						</Button>
					</Link>
				</header>
			</article>
		</section>
	);
}
