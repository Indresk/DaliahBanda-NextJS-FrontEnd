'use client';

import { useState, useTransition } from 'react';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';

// Fila de un elemento hijo editable (enlace, imagen de apoyo, recurso...): resumen, botones Editar/Eliminar y formulario de edición.
// `editForm` es el formulario que se muestra al editar; `onDelete(id)` es la acción de borrado.
export default function ChildItem({ id, label, summary, editForm, onDelete }) {
	const [editing, setEditing] = useState(false);
	const [result, setResult] = useState(null);
	const [pending, startTransition] = useTransition();

	function handleDelete() {
		if (!window.confirm(`¿Eliminar ${label}?`)) return;
		startTransition(async () => setResult(await onDelete(id)));
	}

	return (
		<li className='border-t border-black py-3'>
			<div className='flex flex-wrap items-center gap-3'>
				<div className='flex min-w-0 flex-1 items-center gap-3'>{summary}</div>
				<span className='flex gap-4 text-xs'>
					<button type='button' onClick={() => setEditing((value) => !value)} className='cursor-pointer underline'>
						{editing ? 'Cerrar' : 'Editar'}
					</button>
					<button type='button' disabled={pending} onClick={handleDelete} className='cursor-pointer text-red-400 underline disabled:opacity-50'>
						Eliminar
					</button>
				</span>
			</div>
			<FeedbackMessage result={result} />
			{editing && <div className='mt-3'>{editForm}</div>}
		</li>
	);
}
