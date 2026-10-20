'use client';

import { useState, useTransition } from 'react';
import { removeAllowedEmail } from '@/back/actions/allowedEmails.actions';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';

export default function RemoveAllowedEmailButton({ email }) {
	const [result, setResult] = useState(null);
	const [pending, startTransition] = useTransition();

	function handleRemove() {
		if (!window.confirm(`¿Quitar el acceso de ${email}?`)) return;
		startTransition(async () => setResult(await removeAllowedEmail(email)));
	}

	return (
		<div className='flex items-center justify-end gap-3'>
			{result?.status === 'error' && <FeedbackMessage result={result} />}
			<button
				type='button'
				onClick={handleRemove}
				disabled={pending}
				aria-label={`Quitar acceso de ${email}`}
				className='flex cursor-pointer items-center text-lightgray transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50'>
				<MSOIcon>delete</MSOIcon>
			</button>
		</div>
	);
}
