'use client';

import { useState, useTransition } from 'react';
import {
	confirmAssetUpload,
	createAssetUpload,
} from '@/back/actions/assets.actions';
import { ASSET_MAX_SIZE_BYTES, ASSET_TYPES } from '@/shared/constants';
import { uploadWithProgress } from '../utils/uploadWithProgress';

const MAX_MB = ASSET_MAX_SIZE_BYTES / (1024 * 1024);

// Estado y flujo de subida de assets a la carpeta `prefix`:
// valida en el navegador, pide la URL firmada, sube directo a R2 y confirma.
export function useAssetUploads(prefix) {
	const [items, setItems] = useState([]);
	const [pending, startTransition] = useTransition();

	function updateItem(index, changes) {
		setItems((previous) =>
			previous.map((item, i) => (i === index ? { ...item, ...changes } : item)),
		);
	}

	// Devuelve { file, ok, url } (url pública del archivo ya verificado)
	async function uploadFile(file, index) {
		const fail = (message) => {
			updateItem(index, { status: 'error', message });
			return { file, ok: false, url: null };
		};

		if (!Object.hasOwn(ASSET_TYPES, file.type)) {
			return fail('Tipo de archivo no permitido.');
		}
		if (file.size > ASSET_MAX_SIZE_BYTES) {
			return fail(`Supera el máximo de ${MAX_MB} MB.`);
		}

		try {
			const created = await createAssetUpload({
				prefix,
				name: file.name,
				size: file.size,
				type: file.type,
			});
			if (created.status !== 'success') return fail(created.message);

			const { uploadUrl, token, headers } = created.payload;
			await uploadWithProgress({
				url: uploadUrl,
				headers,
				file,
				onProgress: (progress) => updateItem(index, { progress }),
			});

			updateItem(index, { progress: 100, message: 'Verificando…' });
			const confirmed = await confirmAssetUpload(token);
			const ok = confirmed.status === 'success';
			updateItem(index, { status: ok ? 'ok' : 'error', message: confirmed.message });
			return { file, ok, url: ok ? confirmed.payload.url : null };
		} catch (error) {
			return fail(error.message || 'No se pudo subir el archivo.');
		}
	}

	// Sube los archivos de uno en uno (uno solo ya usa todo el ancho de banda de subida).
	// Al terminar llama a onFinish con el resultado de cada archivo.
	function upload(files, onFinish) {
		setItems(
			files.map((file) => ({
				name: file.name,
				status: 'uploading',
				progress: 0,
				message: 'Subiendo…',
			})),
		);

		startTransition(async () => {
			const results = [];
			for (const [index, file] of files.entries()) {
				results.push(await uploadFile(file, index));
			}
			onFinish?.(results);
		});
	}

	return { items, pending, upload };
}
