import Image from '@/frontend/components/ui/FadeImage';
import Link from 'next/link';
import { buildMetadata } from '@/frontend/seo/buildMetadata';
import { aboutMeta } from '@/frontend/seo/pages/about.meta';

export const metadata = buildMetadata(aboutMeta);

// Imágenes de grupo (ya publicadas en assets)
const GROUP_IMAGES = [
	{
		url: 'https://assets.daliahbanda.com/images/live/unal/show-randb3/unal-postentrevista-3-v1.jpg',
		alt: 'Toda la banda posando durante la entrevista después de la tercera edición del Rock and Blend.',
		className: 'md:col-span-2 aspect-video',
	},
	{
		url: 'https://assets.daliahbanda.com/images/backstage/backstage-usb2-v1.jpg',
		alt: 'Daliah Banda posando en los camerinos de la Universidad San Buenaventura en Bogotá.',
		className: 'aspect-square',
	},
	{
		url: 'https://assets.daliahbanda.com/images/live/cambridge/cambridge-p2p-v1.jpg',
		alt: 'Silvia y Mike de Daliah Banda durante presentación en vivo en el colegio Cambridge en Bogotá.',
		className: 'aspect-square',
	},
];

const headline = 'tracking-tighter font-headline uppercase font-bold';

export default function AboutUs() {
	return (
		<div className='flex flex-col gap-14 px-8 py-14 md:px-14'>
			<section className='flex flex-col gap-6'>
				<h1 className={`${headline} text-4xl md:text-6xl`}>Sobre nosotros</h1>
				<ul className='grid gap-4 md:grid-cols-4'>
					{GROUP_IMAGES.map((image) => (
						<li key={image.url} className={`relative ${image.className}`}>
							<Image
								fill
								sizes='(min-width: 768px) 50vw, 100vw'
								src={image.url}
								alt={image.alt}
								className='object-cover'
							/>
						</li>
					))}
				</ul>
			</section>

			<section className='flex max-w-3xl flex-col gap-6'>
				<h2 className={`${headline} text-3xl md:text-5xl`}>¿Quiénes somos?</h2>
				<p>
					Somos una agrupación musical <strong>colombiana</strong> con más de
					ocho años de trayectoria en la escena alternativa. Nuestra propuesta
					nace del punk rock y el pop punk clásico, integrando la complejidad
					del metal progresivo para crear un sonido energético y contemporáneo.
				</p>
				<p>
					En nuestras letras abordamos temáticas{' '}
					<strong>emocionales, sociales y políticas</strong>, invitando a la
					reflexión personal y colectiva.
				</p>
			</section>

			<section className='flex max-w-3xl flex-col gap-6'>
				<div>
					<h2 className={`${headline} text-3xl md:text-5xl`}>
						Estilo musical e{' '}
						<span className='text-primary-light'>influencias</span>
					</h2>
					<h3 className='font-headline text-sm uppercase tracking-tighter text-lightgray'>
						Metalcore, Pop Emo Punk y Rock Alternativo
					</h3>
				</div>
				<p>
					Nuestro sonido como Daliah se mueve entre el metalcore moderno, el
					<strong> pop emo punk</strong> y el rock alternativo, con influencias
					del punk rock de los 90 y 2000 y el metal progresivo de décadas
					posteriores.
				</p>
				<p>
					De ahí que nuestras canciones sean tan melódicas, intensas y
					<strong> cargadas de energía</strong>, con estructuras dinámicas y una
					fuerte identidad <strong>emocional</strong>.
				</p>
			</section>

			<section className='flex flex-col gap-4 bg-darkgray p-6 md:p-10'>
				<h2 className={`${headline} text-2xl md:text-4xl`}>
					Conoce a los <span className='text-primary-light'>integrantes</span>
				</h2>
				<p>
					Conoce a quienes forman Daliah hoy y la historia de las personas que
					han pasado por la banda desde 2018.
				</p>
				<Link
					href='/sobre-nosotros/integrantes'
					className='w-fit font-headline font-bold uppercase text-primary-light hover:underline'>
					Ver integrantes →
				</Link>
			</section>
		</div>
	);
}
