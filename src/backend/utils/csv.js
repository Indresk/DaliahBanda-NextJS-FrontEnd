import 'server-only';

// Una celda que empiece con = + - @ se interpretaría como fórmula al abrir el CSV en Excel
function csvCell(value) {
	const text = String(value ?? '');
	const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
	return `"${safe.replace(/"/g, '""')}"`;
}

// Convierte filas (arrays) a CSV con BOM, para que Excel lo abra en UTF-8
export function toCsv(rows) {
	const lines = rows.map((row) => row.map(csvCell).join(','));
	return `﻿${lines.join('\r\n')}\r\n`;
}
