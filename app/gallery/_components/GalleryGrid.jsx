'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Button from '@/frontend/components/buttons/GeneralButton';
import { loadMoreGalleryImages } from '@/back/actions/galleryPublic.actions';
import { isOptimizedImageUrl } from '@/shared/utils/images';

// Las primeras imágenes cargan de inmediato; el resto, al acercarse
const EAGER_COUNT = 4;

// Rejilla de fotos con "Ver más". La primera página llega ya renderizada desde el servidor
// (contenido indexable); las siguientes se piden con el cursor de la última imagen.
export default function GalleryGrid({ initialItems, initialCursor, filters }) {
	const [items, setItems] = useState(initialItems);
	const [cursor, setCursor] = useState(initialCursor);
	const [error, setError] = useState(null);
	const [pending, startTransition] = useTransition();

	function loadMore() {
		setError(null);
		startTransition(async () => {
			const result = await loadMoreGalleryImages({ ...filters, cursor });
			if (result.status === 'error') return setError(result.message);

			setItems((previous) => [...previous, ...result.payload.items]);
			setCursor(result.payload.nextCursor);
		});
	}

	if (items.length === 0) {
		return <p className='px-8 pb-14 md:px-14'>Todavía no hay fotos aquí.</p>;
	}

	return (
		<section className='px-8 pb-14 md:px-14'>
			<div className='columns-2 gap-4 md:columns-3 lg:columns-4'>
				{items.map((image, index) => (
					<figure key={image.id} className='mb-4 break-inside-avoid overflow-hidden bg-darkgray'>
						<Image
							src={image.url}
							alt={image.alt}
							unoptimized={!isOptimizedImageUrl(image.url)}
							width={image.width}
							height={image.height}
							loading={index < EAGER_COUNT ? 'eager' : 'lazy'}
							sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
							className='h-auto w-full'
						/>
					</figure>
				))}
			</div>

			{cursor && (
				<div className='mt-6 flex flex-col items-center gap-2'>
					<Button
						type='button'
						onClick={loadMore}
						variant={pending ? 'disabled' : 'secondary'}>
						{pending ? 'Cargando…' : 'Ver más'}
					</Button>
					{error && <p role='alert' className='text-sm text-red-400'>{error}</p>}
				</div>
			)}
		</section>
	);
}
