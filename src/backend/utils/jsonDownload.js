import 'server-only';

import { NextResponse } from 'next/server';

// Respuesta de descarga de un export en JSON: { section, version, exportedAt, ...datos }.
// `version` permite cambiar el formato sin romper los seeders que leen exports antiguos.
export function jsonDownloadResponse(section, data, version = 1) {
	const date = new Date().toISOString().slice(0, 10);
	const body = { section, version, exportedAt: new Date().toISOString(), ...data };

	return new NextResponse(JSON.stringify(body, null, '\t'), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Content-Disposition': `attachment; filename="${section}-${date}.json"`,
			'Cache-Control': 'no-store',
		},
	});
}
