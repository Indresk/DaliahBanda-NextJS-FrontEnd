'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/frontend/components/buttons/GeneralButton';
import { addAllowedEmail } from '@/back/actions/allowedEmails.actions';
import FeedbackMessage from '@/frontend/components/ui/FeedbackMessage';

export default function AddAllowedEmailForm() {
	const [result, formAction] = useActionState(addAllowedEmail, null);

	return (
		<form action={formAction} className='flex flex-col gap-3'>
			<label htmlFor='allowed-email' className='text-sm text-lightgray'>
				Correo de Google que podrá iniciar sesión
			</label>
			<div className='flex flex-wrap gap-3'>
				<input
					id='allowed-email'
					name='email'
					type='email'
					required
					autoComplete='off'
					placeholder='persona@gmail.com'
					className='min-w-64 flex-1 bg-black px-4 py-2 text-sm'
				/>
				<SubmitButton size='sm'>Añadir</SubmitButton>
			</div>
			<FeedbackMessage result={result} />
		</form>
	);
}
