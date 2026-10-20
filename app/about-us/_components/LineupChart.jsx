import Link from 'next/link';
import { LINEUP_ROLES } from '@/shared/constants';
import { buildTimeline } from '../_lib/timeline';

// Color de cada rol (clases completas para que Tailwind las incluya)
const ROLE_COLORS = {
	vocals: 'bg-primary-light',
	backing_vocals: 'bg-pink-200',
	lead_guitar: 'bg-emerald-600',
	rhythm_guitar: 'bg-lime-400',
	bass: 'bg-sky-500',
	keys: 'bg-violet-400',
	drums: 'bg-amber-500',
};

const ROW = 'h-8';

// Gráfico de la formación: una fila por persona, una barra por rol en el tiempo (mensual) y una
// línea vertical por lanzamiento. En pantallas pequeñas se desplaza horizontalmente con los
// nombres fijos. La pestaña Lista tiene la misma información en texto.
export default function LineupChart({ entries, albums }) {
	const timeline = buildTimeline(entries, albums);
	if (!timeline) return null;

	const { rows, years, markers } = timeline;
	const rolesInUse = Object.keys(LINEUP_ROLES).filter((role) =>
		entries.some((entry) => entry.role === role),
	);

	return (
		<figure className='flex flex-col gap-4'>
			<figcaption className='sr-only'>
				Gráfico de la formación por mes. La pestaña Lista contiene la misma
				información en texto.
			</figcaption>
			<div className='overflow-x-auto' aria-hidden='true'>
				<div className='flex min-w-[760px]'>
					<ul className='sticky left-0 z-10 w-36 shrink-0 bg-black'>
						{rows.map((row) => (
							<li
								key={row.key}
								className={`${ROW} flex items-center justify-end pr-3 text-right text-sm`}>
								{row.memberSlug ? (
									<Link
										href={`/about-us/members/${row.memberSlug}`}
										className='truncate hover:text-primary-light hover:underline'>
										{row.name.replace(/"/g, '')}
									</Link>
								) : (
									<span className='truncate'>{row.name}</span>
								)}
							</li>
						))}
						<li className='h-6' />
					</ul>
					<div className='relative flex-1'>
						<ul>
							{rows.map((row) => (
								<li
									key={row.key}
									className={`${ROW} relative border-b border-darkgray`}>
									{row.segments.map((segment) => (
										<span
											key={segment.start}
											title={`${row.name.replace(/"/g, '')} · ${segment.label} · ${segment.range}`}
											className={`absolute top-1.5 h-5 ${ROLE_COLORS[segment.role]}`}
											style={{
												left: `${segment.left}%`,
												width: `${segment.width}%`,
											}}
										/>
									))}
								</li>
							))}
						</ul>
						{markers.map((marker) => (
							<span
								key={marker.title}
								title={marker.title}
								className='absolute top-0 bottom-6 w-0.5 bg-white/80'
								style={{ left: `${marker.left}%` }}
							/>
						))}
						<div className='relative h-6 border-t border-lightgray text-xs text-lightgray'>
							{years.map(({ year, left }) => (
								<span
									key={year}
									className='absolute top-1'
									style={{ left: `${left}%` }}>
									{year}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
			<ul className='flex flex-wrap gap-x-6 gap-y-2 text-sm'>
				{rolesInUse.map((role) => (
					<li key={role} className='flex items-center gap-2'>
						<span
							className={`size-3 ${ROLE_COLORS[role]}`}
							aria-hidden='true'
						/>
						{LINEUP_ROLES[role]}
					</li>
				))}
				{markers.length > 0 && (
					<li className='flex items-center gap-2'>
						<span className='h-3 w-0.5 bg-white/80' aria-hidden='true' />
						Lanzamiento
					</li>
				)}
			</ul>
		</figure>
	);
}
