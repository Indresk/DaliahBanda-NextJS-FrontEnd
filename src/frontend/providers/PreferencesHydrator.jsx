'use client';

import { useEffect } from 'react';
import { usePreferencesStore } from '@/frontend/stores/preferencesStore';

function PreferencesHydrator() {
	useEffect(() => {
		usePreferencesStore.persist.rehydrate();
	}, []);

	return null;
}

export default PreferencesHydrator;

// Migrar posiblemente a una carpeta llamada hydratators o providers
