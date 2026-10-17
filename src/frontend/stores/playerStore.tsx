'use client';

import { create } from 'zustand';
import type { Track } from '@/shared/lib/tracks';

// El elemento <audio> es la fuente de verdad del tiempo y la duración.
// El store solo refleja esos valores (vía eventos del <audio>) y guarda
// la cola, la pista actual y el estado de reproducción.
// El volumen vive (y se persiste) en preferencesStore.

type PlayerState = {
	queue: Track[];
	currentIndex: number;
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	// Se incrementa cada vez que se pide cargar una pista (aunque sea la misma)
	// para que el reproductor sepa que debe cargarla y empezar desde 0.
	loadId: number;

	setQueue: (tracks: Track[], startIndex?: number) => void;
	playTrack: (track: Track, queue?: Track[]) => void;
	playByIndex: (index: number) => void;
	togglePlay: () => void;
	setIsPlaying: (isPlaying: boolean) => void;
	pause: () => void;
	resume: () => void;
	next: () => void;
	prev: () => void;
	setCurrentTime: (time: number) => void;
	setDuration: (duration: number) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
	queue: [],
	currentIndex: -1,
	isPlaying: false,
	currentTime: 0,
	duration: 0,
	loadId: 0,

	setQueue: (tracks, startIndex = 0) =>
		set((state) => ({
			queue: tracks,
			currentIndex: tracks.length ? startIndex : -1,
			isPlaying: tracks.length > 0,
			currentTime: 0,
			duration: 0,
			loadId: state.loadId + 1,
		})),

	playTrack: (track, queue) => {
		const activeQueue = queue ?? get().queue;
		const index = activeQueue.findIndex((t) => t.id === track.id);

		set((state) => ({
			queue: index >= 0 ? activeQueue : [track],
			currentIndex: index >= 0 ? index : 0,
			isPlaying: true,
			currentTime: 0,
			duration: 0,
			loadId: state.loadId + 1,
		}));
	},

	playByIndex: (index) => {
		const { queue } = get();
		if (index < 0 || index >= queue.length) return;
		set((state) => ({
			currentIndex: index,
			isPlaying: true,
			currentTime: 0,
			duration: 0,
			loadId: state.loadId + 1,
		}));
	},

	togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
	setIsPlaying: (isPlaying) => set({ isPlaying }),
	pause: () => set({ isPlaying: false }),
	resume: () => {
		const { currentIndex, queue, playByIndex } = get();
		if (currentIndex === -1 && queue.length > 0) {
			playByIndex(0);
			return;
		}
		set({ isPlaying: true });
	},

	next: () => {
		const { currentIndex, queue, playByIndex } = get();
		if (!queue.length) return;
		if (currentIndex + 1 < queue.length) {
			playByIndex(currentIndex + 1);
		} else {
			// Fin de la cola: se detiene
			set({ isPlaying: false });
		}
	},

	// El reinicio de la pista (si lleva más de 3s) lo resuelve el reproductor,
	// porque necesita el tiempo real del <audio>.
	prev: () => {
		const { currentIndex, playByIndex } = get();
		playByIndex(Math.max(currentIndex - 1, 0));
	},

	setCurrentTime: (time) => set({ currentTime: time }),
	setDuration: (duration) => set({ duration }),
}));
