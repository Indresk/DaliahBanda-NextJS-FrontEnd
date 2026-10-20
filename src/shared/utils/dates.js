// Estas son las funciones para calcular las horas y fechas de los streamings
// Solo calcula por el momento sobre horas en punto, 2:30 no funcionaria
// Para cambiar la hora de inicio podemos cambiar el valor de la constante STREAMING_START_HOUR_BOGOTA

const BOGOTA_OFFSET_MS = -5 * 60 * 60 * 1000;
const STREAMING_START_HOUR_BOGOTA = 14;
const STREAMING_DURATION_MS = 2 * 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getCurrentDateBogota(currentDate) {
	return new Date(currentDate + BOGOTA_OFFSET_MS);
}

export function getStreamingStart(currentDate) {
	const todayBogota = getCurrentDateBogota(currentDate);
	const daysToSunday = (7 - todayBogota.getUTCDay()) % 7;

	const start =
		Date.UTC(
			todayBogota.getUTCFullYear(),
			todayBogota.getUTCMonth(),
			todayBogota.getUTCDate() + daysToSunday,
			STREAMING_START_HOUR_BOGOTA,
			0,
			0,
		) - BOGOTA_OFFSET_MS;

	if (currentDate >= start + STREAMING_DURATION_MS) {
		return new Date(start + WEEK_MS);
	}

	return new Date(start);
}

export function getStreamingEnd(streamingStart) {
	return new Date(streamingStart.getTime() + STREAMING_DURATION_MS);
}

export function getPreviousStreaming(streamingEnd) {
	return new Date(streamingEnd.getTime() - WEEK_MS);
}

export function DateToESString(dateUTC, options = {}) {
	const { hours = false, day = false, all = true } = options;

	const dateBogota = new Date(dateUTC.getTime() + BOGOTA_OFFSET_MS);

	const dayStr = new Intl.DateTimeFormat('es-CO', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(dateBogota);

	const timeStr = new Intl.DateTimeFormat('es-CO', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
		timeZone: 'UTC',
	})
		.format(dateBogota)
		.replace(' ', ' - ');

	if (day) return dayStr;
	if (hours) return timeStr;
	if (all) return `${dayStr} ${timeStr}`;

	return dateBogota.toISOString();
}
