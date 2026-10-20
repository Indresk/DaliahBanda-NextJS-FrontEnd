'use client';

import { create } from 'zustand';

// El elemento <audio> es la fuente de verdad del tiempo y la duración.
// El store solo refleja esos valores (vía eventos del <audio>) y guarda
// la cola, la pista actual y el estado de reproducción.
// El volumen vive (y se persiste) en preferencesStore.

export const usePlayerStore = create((set, get) => ({
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

	prev: () => {
		const { currentIndex, playByIndex } = get();
		playByIndex(Math.max(currentIndex - 1, 0));
	},

	setCurrentTime: (time) => set({ currentTime: time }),
	setDuration: (duration) => set({ duration }),
}));
