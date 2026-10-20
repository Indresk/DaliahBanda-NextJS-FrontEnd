'use client';

import { useRef } from 'react';
import Button from '@/frontend/components/buttons/GeneralButton';
import { useAssetUploads } from '@/frontend/hooks/useAssetUploads';
import UploadProgressList from './UploadProgressList';
import {
	ASSET_MAX_FILES_PER_BATCH,
	ASSET_MAX_SIZE_BYTES,
	ASSET_TYPES,
} from '@/shared/constants';

const ACCEPT = Object.keys(ASSET_TYPES).join(',');
const MAX_MB = ASSET_MAX_SIZE_BYTES / (1024 * 1024);

export default function UploadAssetsForm({ prefix }) {
	const formRef = useRef(null);
	const { items, pending, upload } = useAssetUploads(prefix);

	function handleSubmit(event) {
		event.preventDefault();
		const files = new FormData(event.currentTarget)
			.getAll('files')
			.filter((file) => file.size > 0)
			.slice(0, ASSET_MAX_FILES_PER_BATCH);
		if (files.length === 0) return;

		upload(files, () => formRef.current?.reset());
	}

	return (
		<form ref={formRef} onSubmit={handleSubmit} className='flex flex-col gap-3'>
			<label htmlFor='asset-files' className='text-sm text-lightgray'>
				Subir a <code>/{prefix}</code> (JPG, PNG, WebP, GIF, MP4 o PDF; máx. {MAX_MB}{' '}
				MB c/u, hasta {ASSET_MAX_FILES_PER_BATCH} archivos)
			</label>
			<div className='flex flex-wrap items-center gap-3'>
				<input
					id='asset-files'
					name='files'
					type='file'
					multiple
					required
					accept={ACCEPT}
					className='min-w-64 flex-1 bg-black px-4 py-2 text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-primary file:px-3 file:py-1 file:text-white'
				/>
				<Button type='submit' size='sm' variant={pending ? 'disabled' : 'primary'}>
					{pending ? 'Subiendo…' : 'Subir'}
				</Button>
			</div>
			<p className='text-xs text-lightgray'>
				Los archivos no se sobrescriben: si ya existe el nombre, usa otra versión
				(logo-v2.svg). Se suben directo a Cloudflare, sin pasar por el servidor.
			</p>
			<UploadProgressList items={items} />
		</form>
	);
}
