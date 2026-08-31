'use client';

import {
	signInAction,
	signOutAction,
} from '../../../backend/actions/auth.action';
import { SubmitButton } from './GeneralButton';

export function SignInButton({ children = 'Iniciar sesión' }) {
	return (
		<form action={signInAction} className='contents'>
			<SubmitButton variant='invert'>{children}</SubmitButton>
		</form>
	);
}

export function SignOutButton({ children = 'Cerrar sesión' }) {
	return (
		<form action={signOutAction} className='contents'>
			<SubmitButton>{children}</SubmitButton>
		</form>
	);
}
