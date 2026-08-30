'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePlayerStore } from '@/frontend/stores/playerStore';

function formatTime(value) {
	if (!Number.isFinite(value)) return '0:00';
	const minutes = Math.floor(value / 60);
	const seconds = Math.floor(value % 60);
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
	const audioRef = useRef(null);

	const {
		queue,
		currentIndex,
		isPlaying,
		currentTime,
		duration,
		volume,
		togglePlay,
		next,
		prev,
		setCurrentTime,
		setDuration,
		setVolume,
	} = usePlayerStore();

	const currentTrack = useMemo(() => {
		if (currentIndex < 0 || currentIndex >= queue.length) return null;
		return queue[currentIndex];
	}, [queue, currentIndex]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.volume = volume;
	}, [volume]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentTrack) return;

		const nextSrc = currentTrack.src;
		const currentSrc = audio.currentSrc || audio.src;

		if (currentSrc !== nextSrc) {
			audio.src = nextSrc;
			audio.load();
		}

		if (isPlaying) {
			audio.play().catch(() => {});
		}
	}, [currentTrack, isPlaying]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentTrack) return;

		if (isPlaying) {
			audio.play().catch(() => {});
		} else {
			audio.pause();
		}
	}, [isPlaying, currentTrack]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const onTimeUpdate = () => {
			setCurrentTime(audio.currentTime);
		};

		const onLoadedMetadata = () => {
			setDuration(audio.duration || 0);
		};

		const onEnded = () => {
			next();
		};

		audio.addEventListener('timeupdate', onTimeUpdate);
		audio.addEventListener('loadedmetadata', onLoadedMetadata);
		audio.addEventListener('ended', onEnded);

		return () => {
			audio.removeEventListener('timeupdate', onTimeUpdate);
			audio.removeEventListener('loadedmetadata', onLoadedMetadata);
			audio.removeEventListener('ended', onEnded);
		};
	}, [next, setCurrentTime, setDuration]);

	// ajustar primer render del timer porque no se carga correctamente
	// ajustar playToggle porque elimina el estado del tiempo actual de tag audio

	useEffect(() => {
		const audio = audioRef.current;
		console.log(currentTime);
		if (!audio) return;

		const diff = Math.abs(audio.currentTime - currentTime);
		if (diff > 0.8) {
			audio.currentTime = currentTime;
		}
	}, [currentTime, isPlaying]);

	const handleSeek = (value) => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.currentTime = value;
		setCurrentTime(value);
	};

	if (!currentTrack) {
		return (
			<div className='fixed bottom-0 left-0 right-0'>
				<audio ref={audioRef} preload='metadata' />
				<div className='player-shell'>
					<div className='player-empty'>
						{/* <span>No hay audio reproduciéndose.</span> */}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='fixed bottom-0 left-0 right-0 border-t bg-white p-4 text-black'>
			<audio ref={audioRef} preload='metadata' />
			<div className='flex'>
				<div className='basis-30'>
					{currentTrack.cover ? (
						<img
							src={currentTrack.cover}
							alt={currentTrack.title}
							className='player__cover'
						/>
					) : (
						<div className='player__cover player__cover--placeholder' />
					)}

					<div>
						<p className='player__title'>{currentTrack.title}</p>
						<p className='player__artist'>{currentTrack.artist}</p>
					</div>
				</div>

				<div className='player__controls'>
					<button
						onClick={prev}
						className='player__button'
						aria-label='Anterior'>
						⏮
					</button>

					<button
						onClick={togglePlay}
						className='player__button player__button--primary'
						aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
						{isPlaying ? '⏸' : '▶'}
					</button>

					{/* {isPlaying ? (
						<button
							onClick={() => {
								audioRef.current?.play();
							}}
							className='player__button player__button--primary'
							aria-label={'Reproducir'}>
							{'▶'}
						</button>
					) : (
						<button
							onClick={() => {
								audioRef.current?.pause();
							}}
							className='player__button player__button--primary'
							aria-label={'Pausar'}>
							{'⏸'}
						</button>
					)} */}

					<button
						onClick={next}
						className='player__button'
						aria-label='Siguiente'>
						⏭
					</button>
				</div>

				<div className='player__timeline'>
					<span>{formatTime(currentTime)}</span>
					<input
						type='range'
						min={0}
						max={duration || 0}
						step={0.1}
						value={Math.min(currentTime, duration || 0)}
						onChange={(e) => handleSeek(Number(e.target.value))}
					/>
					<span>{formatTime(duration)}</span>
				</div>

				<div className='player__volume'>
					<span>🔊</span>
					<input
						type='range'
						min={0}
						max={1}
						step={0.01}
						value={volume}
						onChange={(e) => setVolume(Number(e.target.value))}
					/>
				</div>
			</div>
		</div>
	);
}
