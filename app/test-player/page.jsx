// PÁGINA TEMPORAL: solo para probar el reproductor de audio. Borrar la carpeta app/test-player cuando ya no se necesite.
import PlayButton from '../_components/global/AudioPlayer/PlayButton';
import { tracks } from '@/shared/lib/tracks';

/** @type {import('next').Metadata} */
export const metadata = {
	title: 'Prueba del reproductor',
	robots: { index: false, follow: false },
};

export default function TestPlayerPage() {
	return (
		<section className='mx-auto flex max-w-3xl flex-col gap-6 px-8 py-14'>
			<div>
				<h1 className='font-headline text-3xl font-bold uppercase tracking-tighter'>
					Prueba del reproductor
				</h1>
				<p className='text-sm text-lightgray'>
					Página temporal. Revisa: tiempo y duración, avance de la barra, saltos
					con click y arrastre, teclado (flechas sobre la barra),
					anterior/siguiente, fin de cola y volumen.
				</p>
			</div>

			<ul className='flex flex-col divide-y divide-darkgray border-y border-darkgray'>
				{tracks.map((track, index) => (
					<li key={track.id} className='flex items-center justify-between gap-4 py-3'>
						<div>
							<p className='font-headline font-bold uppercase tracking-tighter'>
								{index + 1}. {track.title}
							</p>
							<p className='text-xs text-lightgray'>{track.artist}</p>
						</div>
						<PlayButton track={track} queue={tracks}>
							<span className='flex cursor-pointer items-center gap-1 bg-primary px-4 py-2 font-headline text-sm font-bold uppercase'>
								<span className='material-symbols-outlined'>play_arrow</span>
								Reproducir
							</span>
						</PlayButton>
					</li>
				))}
			</ul>
		</section>
	);
}
