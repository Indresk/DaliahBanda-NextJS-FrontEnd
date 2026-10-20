import { twMerge } from 'tailwind-merge';

const TONES = {
	live: 'bg-primary text-white',
	ok: 'bg-emerald-900 text-emerald-200',
	warn: 'bg-amber-900 text-amber-200',
	neutral: 'bg-zinc-700 text-zinc-200',
};

export default function Badge({ tone = 'neutral', children }) {
	return (
		<span
			className={twMerge(
				'inline-block px-2 py-1 font-headline text-xs font-bold uppercase tracking-wider',
				TONES[tone],
			)}>
			{children}
		</span>
	);
}
