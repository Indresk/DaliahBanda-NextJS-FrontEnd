'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import FeedbackMessage from './FeedbackMessage';

// Botón "Eliminar" con confirmación para la página de edición de una entidad.
//  action(id)   acción del servidor de borrado
//  redirectTo   a dónde ir tras eliminarla
export default function DeleteEntityButton({ id, action, label, confirmMessage, redirectTo }) {
	const router = useRouter();
	const [result, setResult] = useState(null);
	const [pending, startTransition] = useTransition();

	function handleDelete() {
		if (!window.confirm(confirmMessage)) return;

		startTransition(async () => {
			const response = await action(id);
			setResult(response);
			if (response.status === 'success') router.push(redirectTo);
		});
	}

	return (
		<div className='mt-6 border-t border-black pt-4'>
			<button type='button' disabled={pending} onClick={handleDelete} className='cursor-pointer text-sm text-red-400 underline disabled:opacity-50'>
				{label}
			</button>
			<FeedbackMessage result={result} />
		</div>
	);
}
