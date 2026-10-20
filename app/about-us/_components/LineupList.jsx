import Link from 'next/link';
import { LINEUP_ROLES } from '@/shared/constants';

// Años de una entrada: "2018 – 2020", "2024 – hoy" o solo el año
function yearRange({ startYear, endYear }) {
	if (endYear === null) return `${startYear} – hoy`;
	return endYear === startYear ? `${startYear}` : `${startYear} – ${endYear}`;
}

// Lista de la formación (actuales y anteriores), una línea por entrada y en orden cronológico.
// `entries` ya viene ordenado (getLineupTimeline). La nota solo se muestra si existe.
export default function LineupList({ entries }) {
	if (!entries.length) return null;

	return (
		<ul className='flex flex-col divide-y divide-darkgray'>
			{entries.map((entry) => (
				<li key={entry.id} className='py-3'>
					<p className='flex flex-wrap items-baseline gap-x-3'>
						<span className='w-28 shrink-0 text-primary-light'>{yearRange(entry)}</span>
						{entry.memberSlug ? (
							<Link href={`/about-us/members/${entry.memberSlug}`} className='font-bold hover:underline'>
								{entry.personName}
							</Link>
						) : (
							<strong>{entry.personName}</strong>
						)}
						<span className='text-lightgray'>{LINEUP_ROLES[entry.role]}</span>
					</p>
					{entry.note && <p className='pl-31 text-sm text-lightgray'>{entry.note}</p>}
				</li>
			))}
		</ul>
	);
}
