'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const safeStorage = {
	getItem: (name) => {
		try {
			return localStorage.getItem(name);
		} catch {
			return null;
		}
	},
	setItem: (name, value) => {
		try {
			localStorage.setItem(name, value);
		} catch {}
	},
	removeItem: (name) => {
		try {
			localStorage.removeItem(name);
		} catch {}
	},
};

// Gallery filter guardado todavia no se va a usar, queda como guia para cualquier otro estado que se quiera guardar en el futuro

export const usePreferencesStore = create()(
	persist(
		(set) => ({
			daliahClicks: 0,
			volume: 1,
			galleryFilter: 'all',

			incrementClicks: () =>
				set((state) => ({ daliahClicks: state.daliahClicks + 1 })),
			setVolume: (volume) => set({ volume: Math.min(Math.max(volume, 0), 1) }),
			setGalleryFilter: (galleryFilter) => set({ galleryFilter }),
		}),
		{
			name: 'daliah:prefs',
			version: 1,
			storage: createJSONStorage(() => safeStorage),
			partialize: (s) => ({
				daliahClicks: s.daliahClicks,
				volume: s.volume,
				galleryFilter: s.galleryFilter,
			}),
			skipHydration: true,
		},
	),
);
