'use client';

import { useState, useTransition } from 'react';

// Envía un formulario a una acción del servidor (prevState, formData) sin usar la prop
// `action` del <form>: React 19 vacía los campos tras CADA acción, también si falló, y así
// se perdería lo escrito al rechazarse, por ejemplo, un texto alternativo vacío.
//  resetOnSuccess  vacía el formulario solo si la acción tuvo éxito (altas)
export function useFormAction(action, { resetOnSuccess = false } = {}) {
	const [state, setState] = useState(null);
	const [pending, startTransition] = useTransition();

	function handleSubmit(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);

		startTransition(async () => {
			const result = await action(null, formData);
			setState(result);
			if (resetOnSuccess && result.status === 'success') form.reset();
		});
	}

	return { state, pending, handleSubmit };
}
