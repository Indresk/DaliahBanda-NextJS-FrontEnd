'use client';
import Button from '@/components/buttons/GeneralButton';

export default function EmailUpdatesForm() {
	function handleEmailUpdates(e: React.FormEvent) {
		e.preventDefault();
		// Lógica de DB aquí y alertar con modal al usuario que se guardó su correo
	}

	return (
		<form className='w-full md:w-auto' onSubmit={handleEmailUpdates}>
			<label
				htmlFor='emailUpdates'
				className='inline-block font-headline text-primary font-bold uppercase tracking-widest mb-2'>
				Mantente al tanto
			</label>
			<div className='flex'>
				<input
					id='emailUpdates'
					className='bg-darkgray border-0 text-white font-headline text-sm px-4 py-3 w-full md:w-64'
					placeholder='TÚ CORREO'
					type='email'
					name='emailUpdates'
					autoComplete='email'
				/>
				<Button className='flex items-center' type='submit'>
					<span className='material-symbols-outlined'>send</span>
				</Button>
			</div>
		</form>
	);
}
