'use server';

import { signIn, signOut } from '../config/auth';

export async function signInAction() {
	await signIn('google');
}

export async function signOutAction() {
	await signOut();
}
