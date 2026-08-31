import { auth } from '@/back/config/auth';
import {
	SignInButton,
	SignOutButton,
} from '@/front/components/buttons/AuthButtons';

export default async function Login() {
	const session = await auth();

	if (!session?.user) {
		return (
			<div>
				<h1>Login view</h1>
				<h1>No has iniciado sesión</h1>
				<SignInButton />
			</div>
		);
	}

	return (
		<div>
			<h1>Login view</h1>
			<h1>Bienvenido, {session.user.name}</h1>
			<p>Email: {session.user.email}</p>
			{session.user.image && (
				<img
					src={session.user.image}
					alt='User Avatar'
					width={48}
					height={48}
				/>
			)}
			<SignOutButton />
		</div>
	);
}
