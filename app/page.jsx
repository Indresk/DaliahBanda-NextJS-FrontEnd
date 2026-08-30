import Link from 'next/link';
import LiveCard from './_components/index/LiveCard';
import Button from '@/frontend/components/buttons/GeneralButton';
import Integrantes from './_components/index/Integrantes';
import RecommendedSong from './_components/index/RecommendedSong';
import FlyersCarousel from './_components/index/FlyersCarousel';
import Hero from './_components/index/Hero';
import Image from 'next/image';

/** @type {import('next').Metadata} */
export const metadata = {
	title: 'Daliah Banda | Metalcore · Pop Emo Punk desde Bogotá',
	description:
		'Daliah es una banda de metalcore y pop emo punk formada en Bogotá. Su sonido mezcla punk rock, pop-punk y metal progresivo con letras sociales, emocionales y políticas.',
};

export default function Home() {
	//
	return (
		<>
			<Hero />
			<div className='flex flex-row'>
				<picture className='flex items-end basis-[20%] pl-8 pt-14 md:pl-14 shrink-0'>
					<Image
						width={576}
						height={1280}
						className='block h-full w-auto max-w-full object-contain'
						src='https://assets.daliahbanda.com/images/promo/promo-setlist-2025-v1.jpeg'
						alt='Set list de Daliah Banda tocando en vivo en escenario de rock alternativo en Bogotá'
					/>
				</picture>
				<section className='p-8 pt-14 pb-0 md:p-14 md:pb-0 flex-1 flex flex-col gap-6 justify-center '>
					<h2 className='tracking-tighter font-headline uppercase font-bold text-3xl md:text-5xl'>
						¿Quiénes somos?
					</h2>
					<p>
						Somos una agrupación musical <strong>colombiana</strong> con más de
						ocho años de trayectoria en la escena alternativa. Nuestra propuesta
						nace del punk rock y el pop punk clásico, integrando la complejidad
						del metal progresivo para crear un sonido energético y
						contemporáneo.
					</p>
					<p>
						En nuestras letras abordamos temáticas{' '}
						<strong>emocionales, sociales y políticas</strong>, invitando a la
						reflexión personal y colectiva.
					</p>
				</section>

				<LiveCard
					className='hidden md:flex md:basis-[45%]'
					aria-labelledby='live-card'
				/>
			</div>

			<div className='relative'>
				<section className='flex justify-end pt-15 md:pt-20 lg:pt-30 xl:pt-50 pb-14 px-8 md:pr-34'>
					<div className='md:basis-[50%] flex flex-col gap-4'>
						<h2 className='tracking-tighter font-headline uppercase font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>
							¿Quieres vernos en el escenario?
						</h2>
						<Link href='/gallery'>
							<Button variant='textLink' size='noPadding' rigthArrow>
								Visita nuestra galeria de fotos
							</Button>
						</Link>
					</div>
				</section>
				<div className='w-full absolute bottom-0 left-0 z-[-2] aspect-4/3 md:aspect-5/2 mask-[linear-gradient(to_top,black,transparent)]'>
					<Image
						width={1622}
						height={1080}
						loading='eager'
						className='w-full absolute bottom-0 left-0 z-[-2] aspect-4/3 md:aspect-5/2'
						src='https://assets.daliahbanda.com/images/live/unal/show-randb2/unal-show2-34-v1.jpg'
						alt='Guitarrista ritmico tocando en vivo su guitarra estilo stratocaster roja.'
					/>
				</div>
			</div>
			{/* Tarjeta de live - se movio completamente de lugar solo para mobile */}
			<LiveCard className='md:hidden' aria-hidden='true' />

			<div className=''>
				<section className='flex flex-col md:flex-row px-8 py-14 gap-8 md:p-14 md:gap-14'>
					<div className='flex flex-col gap-4 md:gap-14 text-base md:text-lg basis-[50%] self-center'>
						<div>
							<h2 className='tracking-tighter font-headline uppercase font-bold text-5xl'>
								Estilo musical e{' '}
								<span className='text-primary-light'>influencias</span>
							</h2>
							<h3 className='tracking-tighter font-headline uppercase text-sm text-lightgray'>
								Metalcore, Pop Emo Punk y Rock Alternativo
							</h3>
						</div>
						<p>
							Nuestro sonido como Daliah se mueve entre el metalcore moderno, el
							<strong> pop emo punk</strong> y el rock alternativo, con
							influencias del punk rock de los 90 y 2000 y el metal progresivo
							de décadas posteriores.
						</p>
						<p>
							De ahí que nuestras canciones sean tan melódicas, intensas y
							<strong> cargadas de energía</strong>, con estructuras dinámicas y
							una fuerte identidad <strong>emocional</strong>.
						</p>
					</div>
					<div className='grid basis-[50%] grid-cols-[1fr_1fr] grid-rows-6 gap-x-8 md:gap-x-14 lg:gap-x-20 gap-y-6 lg:px-14'>
						<picture className='col-start-1 row-start-2 row-span-2'>
							<Image
								width={1366}
								height={615}
								className='h-full w-full object-cover aspect-square'
								src='https://assets.daliahbanda.com/images/backstage/backstage-usb2-v1.jpg'
								alt='Daliah Banda posando en los camerinos de la Universidad San Buenaventura en Bogotá.'
							/>
						</picture>
						<picture className='col-start-1 row-start-5 row-span-2'>
							<Image
								width={1080}
								height={1350}
								className='h-full w-full object-cover aspect-square'
								src='https://assets.daliahbanda.com/images/backstage/recording-silvia-1-v1.webp'
								alt='Silvia, cantante de Daliah Banda durante la sesión de grabación de voces.'
							/>
						</picture>
						<picture className='col-start-2 row-start-1 row-span-2'>
							<Image
								width={829}
								height={545}
								className='h-full w-full object-cover aspect-square'
								src='https://assets.daliahbanda.com/images/live/cambridge/cambridge-p2p-v1.jpg'
								alt='Silvia y Mike de Daliah Banda durante presentación en vivo en el colegio Cambridge en bogotá.'
							/>
						</picture>
						<picture className='col-start-2 row-start-4 row-span-2'>
							<Image
								width={901}
								height={1600}
								className='h-full w-full object-cover aspect-square'
								src='https://assets.daliahbanda.com/images/live/kaiju/kaiju-show-v1.jpeg'
								alt='Daliah Banda durante presentación en vivo en el bar Kaiju en Bogotá.'
							/>
						</picture>
					</div>
				</section>

				<section className='relative'>
					<div className='bg-[#d8d8d8] p-4 px-14 md:p-18 -rotate-12 flex justify-around items-center scale-120 z-[-1] w-full absolute top-0 left-[0%]'>
						<div>
							<h2 className='tracking-tighter font-headline uppercase font-bold text-2xl md:text-5xl text-black'>
								<span className='text-primary'>Integrantes</span> de la banda
							</h2>
							<h3 className='tracking-tighter font-headline uppercase text-sm text-lightgray'>
								Formación actual
							</h3>
						</div>
						<picture className='basis-30 rotate-12'>
							<Image
								width={763.92}
								height={763.92}
								src='https://assets.daliahbanda.com/brand/logos/icon/logo-d-daliah-vector-v1.svg'
								alt='Logo de Daliah Banda sobre fondo blanco.'
							/>
						</picture>
					</div>
					<div className='py-15 md:py-23'></div>
					<Integrantes />
				</section>
			</div>
			<div className='px-8 pb-14 md:px-14'>
				<RecommendedSong />
			</div>

			<FlyersCarousel />
		</>
	);
}
