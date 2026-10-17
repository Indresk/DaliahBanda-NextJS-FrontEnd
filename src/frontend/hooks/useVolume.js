import { useState } from 'react';
import { usePreferencesStore } from '@/frontend/stores/preferencesStore';

export function useVolume() {
	const [muted, setMuted] = useState(false);
	const volume = usePreferencesStore((state) => state.volume);
	const setVolume = usePreferencesStore((state) => state.setVolume);
	const shownVolume = muted ? 0 : volume;

	function toggleMute() {
		if (shownVolume > 0) {
			setMuted(true);
		} else {
			setMuted(false);
			if (volume === 0) setVolume(1);
		}
	}

	function changeVolume(value) {
		setMuted(false);
		setVolume(value);
	}

	return { volume: shownVolume, toggleMute, changeVolume };
}
