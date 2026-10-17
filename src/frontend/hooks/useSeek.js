import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/frontend/stores/playerStore';

// Mientras se arrastra la barra solo se muestra el tiempo "scrubTime"
// el salto real se aplica al soltar, con el evento nativo 'change'
export function useSeek(audioRef, enabled) {
	const seekRef = useRef(null);
	const [scrubTime, setScrubTime] = useState(null);
	const currentTime = usePlayerStore((state) => state.currentTime);
	const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);

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
	}, [audioRef, enabled, setCurrentTime]);

	return {
		seekRef,
		shownTime: scrubTime ?? currentTime,
		setScrubTime,
	};
}
