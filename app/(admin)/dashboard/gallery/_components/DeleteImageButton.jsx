'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';
import { deleteGalleryImages } from '@/back/actions/galleryImages.actions';

export default function DeleteImageButton({ id }) {
	const router = useRouter();
	const [alsoDeleteFiles, setAlsoDeleteFiles] = useState(false);
	const [result, setResult] = useState(null);
	const [pending, startTransition] = useTransition();

	function handleDelete() {
		const files = alsoDeleteFiles ? ' y su archivo del bucket (irreversible)' : '';
		if (!window.confirm(`¿Eliminar esta imagen de la galería${files}?`)) return;

		startTransition(async () => {
			const response = await deleteGalleryImages({ ids: [id], alsoDeleteFiles });
			setResult(response);
			if (response.status === 'success') router.push('/dashboard/gallery');
		});
	}

	return (
		<div className='mt-8 flex flex-col gap-2 border-t border-darkgray pt-6'>
			<h2 className='font-headline text-sm uppercase'>Eliminar</h2>
			<label className='flex items-center gap-2 text-sm text-lightgray'>
				<input type='checkbox' checked={alsoDeleteFiles} onChange={(e) => setAlsoDeleteFiles(e.target.checked)} />
				Borrar también el archivo del bucket (puede estar en uso en otra parte del sitio)
			</label>
			<button
				type='button'
				onClick={handleDelete}
				disabled={pending}
				className='cursor-pointer self-start bg-red-900 px-4 py-2 font-headline text-sm font-bold uppercase disabled:opacity-50'>
				Eliminar imagen
			</button>
			<FeedbackMessage result={result} />
		</div>
	);
}
