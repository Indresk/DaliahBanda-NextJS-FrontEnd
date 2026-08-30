'use client';

import { create } from 'zustand';
import type { Track } from '@/shared/lib/tracks';

type PlayerState = {
	queue: Track[];
	currentIndex: number;
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;

	setQueue: (tracks: Track[], startIndex?: number) => void;
	playTrack: (track: Track, queue?: Track[]) => void;
	playByIndex: (index: number) => void;
	togglePlay: () => void;
	pause: () => void;
	resume: () => void;
	next: () => void;
	prev: () => void;
	setCurrentTime: (time: number) => void;
	setDuration: (duration: number) => void;
	setVolume: (volume: number) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
	queue: [],
	currentIndex: -1,
	isPlaying: false,
	currentTime: 0,
	duration: 0,
	volume: 1,

	setQueue: (tracks, startIndex = 0) =>
		set({
			queue: tracks,
			currentIndex: tracks.length ? startIndex : -1,
			isPlaying: tracks.length > 0,
			currentTime: 0,
			duration: 0,
		}),

	playTrack: (track, queue) => {
		const activeQueue = queue ?? get().queue;
		const index = activeQueue.findIndex((t) => t.id === track.id);

		if (index >= 0) {
			set({
				queue: activeQueue,
				currentIndex: index,
				isPlaying: true,
				currentTime: 0,
			});
			return;
		}

		set({
			queue: [track],
			currentIndex: 0,
			isPlaying: true,
			currentTime: 0,
		});
	},

	playByIndex: (index) => {
		const { queue } = get();
		if (index < 0 || index >= queue.length) return;
		set({ currentIndex: index, isPlaying: true, currentTime: 0 });
	},

	togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
	pause: () => set({ isPlaying: false }),
	resume: () => {
		const { currentIndex, queue } = get();
		if (currentIndex === -1 && queue.length > 0) {
			set({ currentIndex: 0, isPlaying: true });
			return;
		}
		set({ isPlaying: true });
	},

	next: () => {
		const { currentIndex, queue } = get();
		if (!queue.length) return;
		const nextIndex = currentIndex + 1;
		if (nextIndex < queue.length) {
			set({ currentIndex: nextIndex, isPlaying: true, currentTime: 0 });
		} else {
			set({ isPlaying: false });
		}
	},

	prev: () => {
		const { currentIndex, currentTime } = get();
		if (currentTime > 3) {
			set({ currentTime: 0 });
			return;
		}
		const prevIndex = currentIndex - 1;
		if (prevIndex >= 0) {
			set({ currentIndex: prevIndex, isPlaying: true, currentTime: 0 });
		}
	},

	setCurrentTime: (time) => set({ currentTime: time }),
	setDuration: (duration) => set({ duration }),
	setVolume: (volume) => set({ volume }),
}));
