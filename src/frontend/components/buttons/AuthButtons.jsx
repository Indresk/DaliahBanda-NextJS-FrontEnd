'use client';

import {
	signInAction,
	signOutAction,
} from '../../../backend/actions/auth.action';
import { SubmitButton } from './GeneralButton';

export function SignInButton({ children = 'Iniciar sesión', ...props }) {
	return (
		<form action={signInAction} className='contents'>
			<SubmitButton {...props}>{children}</SubmitButton>
		</form>
	);
}

export function SignOutButton({ children = 'Cerrar sesión', ...props }) {
	return (
		<form action={signOutAction} className='contents'>
			<SubmitButton {...props}>{children}</SubmitButton>
		</form>
	);
}
