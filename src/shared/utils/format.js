import { DateToESString } from './dates';

// Fecha y hora (o solo día con { day: true }) en hora de Bogotá; "—" si no hay valor
export function formatDateTime(value, options) {
	return value ? DateToESString(new Date(value), options) : '—';
}

export function formatFileSize(bytes) {
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
