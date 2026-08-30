import { signOut } from '@/back/config/auth';

export default function SignOut() {
	return (
		<form
			action={async () => {
				'use server';
				await signOut();
			}}>
			<button type='submit'>Cerrar sesión</button>
		</form>
	);
}
