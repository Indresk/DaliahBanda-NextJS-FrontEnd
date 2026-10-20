'use client';

import { useState, useTransition } from 'react';
import { deleteAsset } from '@/back/actions/assets.actions';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';

export default function AssetActions({ assetKey, url, name }) {
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState(null);
	const [pending, startTransition] = useTransition();

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setError('No se pudo copiar la URL.');
		}
	}

	function handleDelete() {
		if (!window.confirm(`¿Eliminar ${name}? Si el sitio lo usa, dejará de verse.`)) return;

		startTransition(async () => {
			const result = await deleteAsset(assetKey);
			if (result.status === 'error') setError(result.message);
		});
	}

	return (
		<div className='flex flex-col gap-1'>
			<div className='flex items-center gap-3'>
				<button
					type='button'
					onClick={handleCopy}
					className='flex cursor-pointer items-center gap-1 text-xs text-lightgray transition-colors hover:text-white'>
					<MSOIcon className='text-base'>{copied ? 'check' : 'content_copy'}</MSOIcon>
					{copied ? 'Copiada' : 'URL'}
				</button>
				<button
					type='button'
					onClick={handleDelete}
					disabled={pending}
					aria-label={`Eliminar ${name}`}
					className='ml-auto flex cursor-pointer items-center text-lightgray transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50'>
					<MSOIcon className='text-base'>delete</MSOIcon>
				</button>
			</div>
			{error && (
				<p role='status' className='text-xs text-red-400'>
					{error}
				</p>
			)}
		</div>
	);
}
