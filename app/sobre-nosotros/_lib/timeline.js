import { LINEUP_ROLES } from '@/shared/constants';

const ROLE_ORDER = Object.keys(LINEUP_ROLES);

// Posición en meses desde el año 0: permite comparar y restar fechas con año + mes
const monthIndex = (year, month) => year * 12 + (month - 1);

const monthFormat = new Intl.DateTimeFormat('es-CO', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatMonth = (index) =>
	monthFormat.format(new Date(Date.UTC(Math.floor(index / 12), index % 12, 1))).replace('.', '');

// Datos del gráfico de la formación (todo en porcentajes del eje de tiempo):
//  entries  línea del tiempo (getLineupTimeline); sin mes, el inicio es enero y el fin diciembre
//  albums   álbumes y sencillos publicados (líneas verticales de lanzamiento)
//  now      fecha actual: las entradas sin fin llegan hasta este mes
// Devuelve { rows, years, markers } o null si no hay entradas.
export function buildTimeline(entries, albums, now = new Date()) {
	if (!entries.length) return null;

	const nowIndex = monthIndex(now.getUTCFullYear(), now.getUTCMonth() + 1);
	const spans = entries.map((entry) => ({
		entry,
		start: monthIndex(entry.startYear, entry.startMonth ?? 1),
		// Fin exclusivo: la barra cubre el mes de fin completo
		end:
			entry.endYear === null
				? nowIndex + 1
				: monthIndex(entry.endYear, entry.endMonth ?? 12) + 1,
	}));

	const first = Math.min(...spans.map((span) => span.start));
	const domainStart = Math.floor(first / 12) * 12;
	const domainEnd = Math.max(...spans.map((span) => span.end), nowIndex + 1);
	const total = domainEnd - domainStart;
	const percent = (index) => ((index - domainStart) / total) * 100;

	// Una fila por persona; Rafa, con dos roles, tiene dos barras en su fila
	const people = new Map();
	for (const span of spans) {
		const key = span.entry.memberId ?? span.entry.personName;
		const person = people.get(key) ?? {
			key,
			name: span.entry.personName,
			memberSlug: span.entry.memberSlug,
			segments: [],
		};
		person.segments.push({
			role: span.entry.role,
			label: LINEUP_ROLES[span.entry.role],
			left: percent(span.start),
			width: percent(span.end) - percent(span.start),
			ongoing: span.entry.endYear === null,
			range: `${formatMonth(span.start)} – ${span.entry.endYear === null ? 'hoy' : formatMonth(span.end - 1)}`,
			start: span.start,
		});
		people.set(key, person);
	}

	// Filas por familia de instrumento (la de su primera barra) y, dentro, por fecha de ingreso
	const rows = [...people.values()]
		.map((person) => {
			const segments = person.segments.sort((a, b) => a.start - b.start);
			return { ...person, segments, family: ROLE_ORDER.indexOf(segments[0].role), start: segments[0].start };
		})
		.sort((a, b) => a.family - b.family || a.start - b.start);

	const years = [];
	for (let index = domainStart; index < domainEnd; index += 12) {
		years.push({ year: index / 12, left: percent(index) });
	}

	const markers = albums
		.map((album) => ({
			title: album.title,
			index: monthIndex(Number(album.releasedAt.slice(0, 4)), Number(album.releasedAt.slice(5, 7))),
		}))
		.filter((marker) => marker.index >= domainStart && marker.index <= domainEnd)
		.map((marker) => ({ title: `${marker.title} · ${formatMonth(marker.index)}`, left: percent(marker.index) }));

	return { rows, years, markers };
}
