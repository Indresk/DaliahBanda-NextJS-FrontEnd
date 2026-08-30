import { signIn } from '@/back/config/auth';

export default function SignIn() {
	return (
		<form
			action={async () => {
				'use server';
				await signIn('google');
			}}>
			<button type='submit'>Iniciar sesión con Google</button>
		</form>
	);
}
