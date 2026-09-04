'use client';
import { SubmitButton } from '@/frontend/components/buttons/GeneralButton';
import { createUser } from '@/back/actions/user.actions';
import { useRef, useState } from 'react';

export default function EmailUpdatesForm() {
	const [status, setStatus] = useState('idle');
	const formRef = useRef(null);

	async function handleEmailUpdates(formData) {
		setStatus('loading');
		const email = formData.get('emailUpdates');
		try {
			const response = await createUser(email);
			console.log(response);

			if ((response.status = 'error')) throw new Error(response?.message);

			setStatus('success');
			formRef.current?.reset();

			// cambiar alert por modal
			alert('¡Correo registrado exitosamente!');
		} catch (error) {
			console.log(error);
			setStatus('error');
			// cambiar alert por modal
			alert(
				`Hubo un error al registrar tu correo: ${error.message}. Intenta de nuevo.`,
			);
		}
	}

	return (
		<form
			className='w-full md:w-auto'
			ref={formRef}
			action={handleEmailUpdates}>
			<label
				htmlFor='emailUpdates'
				className='inline-block font-headline text-primary font-bold uppercase tracking-widest mb-2'>
				Mantente al tanto
			</label>
			<div className='flex'>
				<input
					className='bg-darkgray border-0 text-white font-headline text-sm px-4 py-3 w-full md:w-64 disabled:bg-gray-500'
					placeholder='TÚ CORREO'
					type='email'
					name='emailUpdates'
					autoComplete='email'
					disabled={status === 'loading' || status === 'success'}
				/>
				<SubmitButton>
					{status === 'loading' ? (
						<span className='material-symbols-outlined animate-spin'>
							progress_activity
						</span>
					) : (
						<span className='material-symbols-outlined'>send</span>
					)}
				</SubmitButton>
			</div>
		</form>
	);
}
