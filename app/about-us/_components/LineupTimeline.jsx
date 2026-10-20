import Link from 'next/link';

// Rango de años de una entrada: "2018 – 2020", "2024 – hoy" o solo el año
function yearRange({ startYear, endYear }) {
	if (endYear === null) return `${startYear} – hoy`;
	return endYear === startYear ? `${startYear}` : `${startYear} – ${endYear}`;
}

// Línea del tiempo de la formación (actuales y anteriores), agrupada por año de ingreso.
// `entries` ya viene en orden cronológico (getLineupTimeline).
export default function LineupTimeline({ entries }) {
	if (!entries.length) return null;

	const byYear = new Map();
	for (const entry of entries) {
		byYear.set(entry.startYear, [...(byYear.get(entry.startYear) ?? []), entry]);
	}

	return (
		<ol className='flex flex-col gap-8 border-l-2 border-primary pl-6'>
			{[...byYear].map(([year, items]) => (
				<li key={year} className='relative'>
					<span className='absolute -left-[33px] top-1 size-3 bg-primary' aria-hidden='true' />
					<h3 className='font-headline text-3xl font-bold tracking-tighter text-primary-light'>{year}</h3>
					<ul className='mt-2 flex flex-col gap-3'>
						{items.map((entry) => (
							<li key={entry.id}>
								<p>
									{entry.memberSlug ? (
										<Link href={`/about-us/members/${entry.memberSlug}`} className='font-bold hover:underline'>
											{entry.personName}
										</Link>
									) : (
										<strong>{entry.personName}</strong>
									)}{' '}
									<span className='text-lightgray'>
										· {entry.role} · {yearRange(entry)}
									</span>
								</p>
								{entry.note && <p className='text-sm'>{entry.note}</p>}
							</li>
						))}
					</ul>
				</li>
			))}
		</ol>
	);
}
