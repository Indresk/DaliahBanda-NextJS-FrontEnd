// import { LiveContext } from "../context/LiveContext"
import { useContext } from 'react';

// import { Link } from

import {
	getStreamingStart,
	getStreamingEnd,
	DateToESString,
} from '@/utils/dates.js';

const UTCDateStart = getStreamingStart();
const UTCDateEnd = getStreamingEnd();
const startDate = DateToESString(UTCDateStart, { day: true });
const startHour = DateToESString(UTCDateStart, { hours: true });
const endHour = DateToESString(UTCDateEnd, { hours: true });

export default function LiveView() {
	// const {liveStatus} = useContext(LiveContext)

	const liveStatus = false;

	return (
		<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			<section>
				<h1>Daliah Banda en vivo | Ensayo oficial vía Kick desde Bogotá</h1>
				<p>
					Transmisión en directo de los ensayos oficiales de Daliah Banda, banda
					de metalcore y pop emo punk formada en Bogotá, Colombia. Sigue el
					proceso creativo, la ejecución instrumental y la energía real de la
					agrupación en tiempo real.
				</p>
			</section>
			<section aria-labelledby='stream-player'>
				<h2 id='stream-player'>Ensayo en vivo</h2>
				<div className='video-container'>
					{liveStatus ? (
						<iframe
							className='w-full aspect-video'
							src='https://player.kick.com/daliahbanda'
							allowFullScreen></iframe>
					) : (
						<div className='aspect-video bg-gray-500 flex justify-center items-center w-full gap-4 flex-wrap p-4'>
							<p>
								No estamos en live ahora mismo, puedes seguir el canal oficial
								en{' '}
								<a
									className='underline text-pink-800'
									href='https://kick.com/daliahbanda'
									target='_blank'
									rel='noopener noreferrer'>
									Kick
								</a>{' '}
								para recibir notificaciones cuando inicie el próximo ensayo.
							</p>
							<div className='flex flex-col justify-center items-center'>
								<p>Último live:</p>
								<iframe
									className='w-full aspect-video'
									src='https://player.kick.com/daliahbanda'
									allowFullScreen></iframe>
							</div>
						</div>
					)}
				</div>
			</section>
			<section aria-labelledby='event-details'>
				<h2 id='event-details'>Próximo ensayo en vivo</h2>
				<p>
					El ensayo en vivo está programado para el{' '}
					<strong> {startDate} </strong> desde las{' '}
					<strong>
						{startHour} hasta las {endHour} (hora Colombia, UTC-5)
					</strong>
					. La transmisión se realiza desde Bogotá y está disponible en formato
					streaming.
				</p>

				<p>
					Durante la sesión se trabajará repertorio actual y material inédito,
					incluyendo canciones como <em>El amor se acabó</em>,{' '}
					<em>Intento sobrevivir</em>, <em>Si podré</em> y <em>Rebelión</em>.
				</p>
			</section>

			<section aria-labelledby='what-to-expect'>
				<h2 id='what-to-expect'>¿Qué puedes esperar del streaming?</h2>

				<ul>
					<li>Ensayos completos en tiempo real.</li>
					<li>Arreglos y variaciones antes de su versión final.</li>
					<li>Interacción directa con la banda a través del chat.</li>
					<li>Adelantos de nuevas composiciones.</li>
					<li>Contenido exclusivo del proceso creativo.</li>
				</ul>
				<p>
					Cada transmisión refleja la combinación de riffs intensos, estructuras
					dinámicas y contrastes emocionales que caracterizan el sonido de
					Daliah Banda dentro de la escena alternativa colombiana.
				</p>
			</section>

			<section aria-labelledby='about-band'>
				<h2 id='about-band'>Sobre Daliah Banda</h2>

				<p>
					Formada en 2018 en Bogotá, Daliah Banda fusiona influencias del punk
					rock clásico, el pop-punk de los 2000 y la complejidad del metal
					progresivo contemporáneo. Su propuesta combina potencia instrumental,
					melodía y letras que abordan temáticas emocionales, sociales y
					políticas.
				</p>

				<p>
					Con más de cinco años de trayectoria en la escena alternativa
					bogotana, la banda ha participado en eventos culturales y
					universitarios, consolidando una comunidad que conecta con su
					identidad sonora.
				</p>

				<p>
					Conoce más sobre Daliah banda en la{' '}
					{/* <Link
						to='/'
						className='underline text-pink-800'
						title='Página principal de Daliah Banda'> */}
					página principal
					{/* </Link>{' '} */}o explora nuestra sección de{' '}
					{/* <Link
						to='/musica'
						className='underline text-pink-800'
						title='Música de Daliah Banda'> */}
					música y lanzamientos
					{/* </Link> */}.
				</p>
			</section>

			<section aria-labelledby='support'>
				<h2 id='support'>Apoya el proyecto</h2>

				<p>
					Puedes apoyar el crecimiento de Daliah Banda compartiendo la
					transmisión, siguiendo el canal en Kick y conectando con la banda en
					sus redes sociales oficiales. El respaldo de la audiencia fortalece la
					escena metalcore y alternativa en Colombia.
				</p>
			</section>
		</div>
	);
}
