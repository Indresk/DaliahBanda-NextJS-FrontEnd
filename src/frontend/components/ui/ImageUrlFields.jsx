'use client';

import { useState } from 'react';
import Image from 'next/image';
import Field, { controlClass } from './Field';

const DEFAULT_NAMES = { url: 'url', width: 'width', height: 'height' };

// URL https de una imagen con vista previa. Al cargar la vista previa se leen las dimensiones
// reales (si `withSize`). `names` permite usar otros nombres de campo (p. ej. featuredUrl).
export default function ImageUrlFields({
	idPrefix,
	initial = {},
	names = DEFAULT_NAMES,
	withSize = true,
	readOnly = false,
	urlLabel = 'URL de la imagen',
	urlHint,
	required = true,
	sizeRequired = required,
	onUrlChange,
}) {
	const [url, setUrl] = useState(initial.url ?? '');
	const [size, setSize] = useState({ width: initial.width ?? '', height: initial.height ?? '' });

	const canPreview = /^https:\/\//.test(url);

	return (
		<>
			<Field label={urlLabel} htmlFor={`${idPrefix}-url`} hint={urlHint}>
				<input
					id={`${idPrefix}-url`}
					name={names.url}
					type='url'
					required={required}
					readOnly={readOnly}
					value={url}
					onChange={(e) => {
						setUrl(e.target.value);
						onUrlChange?.(e.target.value);
					}}
					className={controlClass}
				/>
			</Field>
			<div className='relative aspect-video w-full overflow-hidden bg-darkgray'>
				{canPreview ? (
					<Image
						src={url}
						alt='Vista previa'
						fill
						unoptimized
						sizes='(min-width: 1024px) 50vw, 100vw'
						className='object-contain'
						onLoad={(e) =>
							setSize({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })
						}
					/>
				) : (
					<p className='p-4 text-sm text-lightgray'>La vista previa aparece al indicar una URL https.</p>
				)}
			</div>
			{withSize && (
				<div className='grid grid-cols-2 gap-4'>
					<Field label='Ancho (px)' htmlFor={`${idPrefix}-width`} hint='Se detecta al cargar la imagen.'>
						<input id={`${idPrefix}-width`} name={names.width} type='number' min={1} required={sizeRequired} value={size.width} onChange={(e) => setSize((s) => ({ ...s, width: e.target.value }))} className={controlClass} />
					</Field>
					<Field label='Alto (px)' htmlFor={`${idPrefix}-height`}>
						<input id={`${idPrefix}-height`} name={names.height} type='number' min={1} required={sizeRequired} value={size.height} onChange={(e) => setSize((s) => ({ ...s, height: e.target.value }))} className={controlClass} />
					</Field>
				</div>
			)}
		</>
	);
}
