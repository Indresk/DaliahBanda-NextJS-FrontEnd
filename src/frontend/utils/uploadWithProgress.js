// Sube `file` con un PUT a una URL firmada. Usa XMLHttpRequest porque fetch no informa del
// progreso de subida. `onProgress` recibe un porcentaje (0-100).
export function uploadWithProgress({ url, headers, file, onProgress }) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', url);
		Object.entries(headers).forEach(([name, value]) =>
			xhr.setRequestHeader(name, value),
		);

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				onProgress(Math.round((event.loaded / event.total) * 100));
			}
		};
		xhr.onload = () =>
			xhr.status >= 200 && xhr.status < 300
				? resolve()
				: reject(new Error(`R2 rechazó la subida (${xhr.status}).`));
		xhr.onerror = () =>
			reject(
				new Error('No se pudo conectar con R2. Revisa las reglas CORS del bucket.'),
			);

		xhr.send(file);
	});
}
