import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePlayerStore } from '@/frontend/stores/playerStore';

// sincroniza <audio> y el playerStore
export function useAudioSync(audioRef, trackSrc, volume) {
	const { isPlaying, loadId, setIsPlaying, next, setCurrentTime, setDuration } =
		usePlayerStore(
			useShallow((state) => ({
				isPlaying: state.isPlaying,
				loadId: state.loadId,
				setIsPlaying: state.setIsPlaying,
				next: state.next,
				setCurrentTime: state.setCurrentTime,
				setDuration: state.setDuration,
			})),
		);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !trackSrc) return;

		audio.src = trackSrc;
		audio.load();
	}, [audioRef, loadId, trackSrc]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !trackSrc) return;

		if (isPlaying && audio.paused) {
			audio.play().catch((error) => {
				if (error.name !== 'AbortError') setIsPlaying(false);
			});
		} else if (!isPlaying && !audio.paused) {
			audio.pause();
		}
	}, [audioRef, isPlaying, loadId, trackSrc, setIsPlaying]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.volume = volume;
	}, [audioRef, volume]);

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

		const listeners = {
			timeupdate: syncTime,
			seeked: syncTime,
			loadedmetadata: syncDuration,
			durationchange: syncDuration,
			emptied: onEmptied,
			play: onPlay,
			pause: onPause,
			ended: onEnded,
		};

		for (const [event, handler] of Object.entries(listeners)) {
			audio.addEventListener(event, handler);
		}
		return () => {
			for (const [event, handler] of Object.entries(listeners)) {
				audio.removeEventListener(event, handler);
			}
		};
	}, [audioRef, next, setCurrentTime, setDuration, setIsPlaying]);
}
