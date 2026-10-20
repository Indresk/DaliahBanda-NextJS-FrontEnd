import { DateToESString } from './dates';

// Fecha y hora (o solo día con { day: true }) en hora de Bogotá; "—" si no hay valor
export function formatDateTime(value, options) {
	return value ? DateToESString(new Date(value), options) : '—';
}

export function formatFileSize(bytes) {
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// Fecha sin hora (AAAA-MM-DD, como takenAt). No pasa por la zona horaria: "2025-01-01" es
// siempre el 1 de enero, no el 31 de diciembre.
export function formatDateOnly(value) {
	if (!value) return '—';

	return new Intl.DateTimeFormat('es-CO', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(new Date(`${value}T00:00:00Z`));
}
