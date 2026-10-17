'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useShallow } from 'zustand/react/shallow';
import { usePlayerStore } from '@/frontend/stores/playerStore';
import './player.css';

// Si la pista lleva más de estos segundos, "anterior" la reinicia en vez de cambiar de pista
const RESTART_THRESHOLD = 3;

function formatTime(value) {
	if (!Number.isFinite(value) || value < 0) return '0:00';
	const minutes = Math.floor(value / 60);
	const seconds = Math.floor(value % 60);
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
	const audioRef = useRef(null);
	const seekRef = useRef(null);
	const lastVolumeRef = useRef(1);
	// Valor de la barra mientras se arrastra (null = no se está arrastrando)
	const [scrubTime, setScrubTime] = useState(null);

	const {
		queue,
		currentIndex,
		isPlaying,
		currentTime,
		duration,
		volume,
		loadId,
		togglePlay,
		setIsPlaying,
		next,
		prev,
		setCurrentTime,
		setDuration,
		setVolume,
	} = usePlayerStore(
		useShallow((state) => ({
			queue: state.queue,
			currentIndex: state.currentIndex,
			isPlaying: state.isPlaying,
			currentTime: state.currentTime,
			duration: state.duration,
			volume: state.volume,
			loadId: state.loadId,
			togglePlay: state.togglePlay,
			setIsPlaying: state.setIsPlaying,
			next: state.next,
			prev: state.prev,
			setCurrentTime: state.setCurrentTime,
			setDuration: state.setDuration,
			setVolume: state.setVolume,
		})),
	);

	const currentTrack = queue[currentIndex] ?? null;
	const trackSrc = currentTrack?.src;
	const hasTrack = Boolean(currentTrack);
	const isLastTrack = currentIndex >= queue.length - 1;

	// Carga la pista cada vez que se pide una (loadId cambia aunque sea la misma canción)
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !trackSrc) return;

		audio.src = trackSrc;
		audio.load();
	}, [loadId, trackSrc]);

	// Sincroniza play/pausa del store con el elemento <audio>
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !trackSrc) return;

		if (isPlaying && audio.paused) {
			audio.play().catch((error) => {
				// AbortError ocurre cuando una carga nueva interrumpe el play anterior: es esperado
				if (error.name !== 'AbortError') setIsPlaying(false);
			});
		} else if (!isPlaying && !audio.paused) {
			audio.pause();
		}
	}, [isPlaying, loadId, trackSrc, setIsPlaying]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.volume = volume;
	}, [volume]);

	// El <audio> es la fuente de verdad: el store solo refleja sus eventos
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const syncTime = () => setCurrentTime(audio.currentTime);
		const syncDuration = () =>
			setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
		const onEmptied = () => {
			setCurrentTime(0);
			setDuration(0);
		};
		const onPlay = () => setIsPlaying(true);
		const onPause = () => setIsPlaying(false);
		const onEnded = () => next();

		audio.addEventListener('timeupdate', syncTime);
		audio.addEventListener('seeked', syncTime);
		audio.addEventListener('loadedmetadata', syncDuration);
		audio.addEventListener('durationchange', syncDuration);
		audio.addEventListener('emptied', onEmptied);
		audio.addEventListener('play', onPlay);
		audio.addEventListener('pause', onPause);
		audio.addEventListener('ended', onEnded);

		return () => {
			audio.removeEventListener('timeupdate', syncTime);
			audio.removeEventListener('seeked', syncTime);
			audio.removeEventListener('loadedmetadata', syncDuration);
			audio.removeEventListener('durationchange', syncDuration);
			audio.removeEventListener('emptied', onEmptied);
			audio.removeEventListener('play', onPlay);
			audio.removeEventListener('pause', onPause);
			audio.removeEventListener('ended', onEnded);
		};
	}, [next, setCurrentTime, setDuration, setIsPlaying]);

	// El evento nativo "change" del range se dispara al soltar (o con cada paso del teclado):
	// ahí se aplica el salto. Mientras se arrastra solo se actualiza la vista previa.
	useEffect(() => {
		const input = seekRef.current;
		if (!input) return;

		const commitSeek = () => {
			const audio = audioRef.current;
			const value = Number(input.value);
			if (audio && Number.isFinite(value)) {
				audio.currentTime = value;
				setCurrentTime(value);
			}
			setScrubTime(null);
		};

		input.addEventListener('change', commitSeek);
		return () => input.removeEventListener('change', commitSeek);
	}, [hasTrack, setCurrentTime]);

	function handlePrev() {
		const audio = audioRef.current;
		if (audio && (audio.currentTime > RESTART_THRESHOLD || currentIndex === 0)) {
			audio.currentTime = 0;
			setCurrentTime(0);
			return;
		}
		prev();
	}

	function handleToggleMute() {
		if (volume > 0) {
			lastVolumeRef.current = volume;
			setVolume(0);
		} else {
			setVolume(lastVolumeRef.current || 1);
		}
	}

	const shownTime = scrubTime ?? currentTime;
	const progress = duration > 0 ? Math.min((shownTime / duration) * 100, 100) : 0;
	const volumeIcon =
		volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up';

	return (
		<>
			{/* Siempre montado para no perder el estado de reproducción entre renders */}
			<audio ref={audioRef} preload='metadata' />

			{hasTrack && (
				<section
					aria-label='Reproductor de audio'
					className='sticky bottom-0 z-40 border-t border-primary bg-darkgray/95 text-white backdrop-blur'>
					<div className='mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:px-6'>
						{/* Pista actual */}
						<div className='flex min-w-0 items-center gap-3'>
							{currentTrack.cover ? (
								<Image
									unoptimized
									width={48}
									height={48}
									src={currentTrack.cover}
									alt={`Portada de ${currentTrack.title}`}
									className='size-12 shrink-0 object-cover'
								/>
							) : (
								<div className='size-12 shrink-0 bg-primary' aria-hidden='true' />
							)}
							<div className='min-w-0'>
								<p className='truncate font-headline text-sm font-bold uppercase tracking-tighter'>
									{currentTrack.title}
								</p>
								<p className='truncate text-xs text-lightgray'>
									{currentTrack.artist}
								</p>
							</div>
						</div>

						{/* Controles + barra de progreso (en mobile se reparten en dos filas) */}
						<div className='contents md:flex md:flex-col md:items-center md:gap-1'>
							<div className='col-start-2 row-start-1 flex items-center gap-2'>
								<button
									type='button'
									onClick={handlePrev}
									className='flex cursor-pointer items-center text-lightgray transition-colors hover:text-white'
									aria-label='Anterior'>
									<span className='material-symbols-outlined'>skip_previous</span>
								</button>
								<button
									type='button'
									onClick={togglePlay}
									className='flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary transition-transform hover:scale-105'
									aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
									<span className='material-symbols-outlined'>
										{isPlaying ? 'pause' : 'play_arrow'}
									</span>
								</button>
								<button
									type='button'
									onClick={next}
									disabled={isLastTrack}
									className='flex cursor-pointer items-center text-lightgray transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-lightgray'
									aria-label='Siguiente'>
									<span className='material-symbols-outlined'>skip_next</span>
								</button>
							</div>

							<div className='col-span-2 row-start-2 flex w-full items-center gap-3 text-xs tabular-nums text-lightgray'>
								<span className='w-10 text-right'>{formatTime(shownTime)}</span>
								<input
									ref={seekRef}
									type='range'
									min={0}
									max={duration || 0}
									step={0.1}
									value={Math.min(shownTime, duration || 0)}
									disabled={!duration}
									onChange={(e) => setScrubTime(Number(e.target.value))}
									className='player-range'
									style={{ '--progress': `${progress}%` }}
									aria-label='Posición de la canción'
									aria-valuetext={`${formatTime(shownTime)} de ${formatTime(duration)}`}
								/>
								<span className='w-10'>{formatTime(duration)}</span>
							</div>
						</div>

						{/* Volumen (solo desktop; en mobile se usa el del dispositivo) */}
						<div className='hidden items-center justify-end gap-2 md:flex'>
							<button
								type='button'
								onClick={handleToggleMute}
								className='flex cursor-pointer items-center text-lightgray transition-colors hover:text-white'
								aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}>
								<span className='material-symbols-outlined'>{volumeIcon}</span>
							</button>
							<input
								type='range'
								min={0}
								max={1}
								step={0.01}
								value={volume}
								onChange={(e) => setVolume(Number(e.target.value))}
								className='player-range max-w-28'
								style={{ '--progress': `${volume * 100}%` }}
								aria-label='Volumen'
							/>
						</div>
					</div>
				</section>
			)}
		</>
	);
}
