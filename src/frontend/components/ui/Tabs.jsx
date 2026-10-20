'use client';

import { useId, useState } from 'react';
import { twMerge } from 'tailwind-merge';

// Pestañas accesibles. Todos los paneles se renderizan en el servidor (el texto queda en el HTML) y
// solo cambia cuál se ve.
//  tabs  [{ id, label, content }]; la primera está activa al cargar
export default function Tabs({ tabs, label }) {
	const baseId = useId();
	const [active, setActive] = useState(tabs[0].id);

	function handleKeyDown(event, index) {
		const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
		if (!step) return;

		event.preventDefault();
		const next = tabs[(index + step + tabs.length) % tabs.length];
		setActive(next.id);
		document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
	}

	return (
		<div className='flex flex-col gap-6'>
			<div role='tablist' aria-label={label} className='flex gap-2 border-b border-darkgray pb-3'>
				{tabs.map((tab, index) => (
					<button
						key={tab.id}
						id={`${baseId}-tab-${tab.id}`}
						type='button'
						role='tab'
						aria-selected={active === tab.id}
						aria-controls={`${baseId}-panel-${tab.id}`}
						tabIndex={active === tab.id ? 0 : -1}
						onClick={() => setActive(tab.id)}
						onKeyDown={(event) => handleKeyDown(event, index)}
						className={twMerge(
							'cursor-pointer px-3 py-1 font-headline text-sm uppercase tracking-tight text-lightgray transition-colors hover:text-white',
							active === tab.id && 'bg-primary !text-white',
						)}>
						{tab.label}
					</button>
				))}
			</div>
			{tabs.map((tab) => (
				<div
					key={tab.id}
					id={`${baseId}-panel-${tab.id}`}
					role='tabpanel'
					aria-labelledby={`${baseId}-tab-${tab.id}`}
					hidden={active !== tab.id}>
					{tab.content}
				</div>
			))}
		</div>
	);
}
