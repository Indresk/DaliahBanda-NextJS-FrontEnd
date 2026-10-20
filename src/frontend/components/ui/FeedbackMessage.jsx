import { twMerge } from 'tailwind-merge';

// Muestra el resultado ({ status, message }) de una acción del servidor
export default function FeedbackMessage({ result }) {
	if (!result?.message) return null;

	return (
		<p
			role='status'
			className={twMerge(
				'text-sm',
				result.status === 'success' ? 'text-emerald-400' : 'text-red-400',
			)}>
			{result.message}
		</p>
	);
}
