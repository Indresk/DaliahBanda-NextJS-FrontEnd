import { twMerge } from 'tailwind-merge';

// Material Symbols Outlined: el nombre del icono se pasa como children.
export default function MSOIcon({ children, className, ...props }) {
	return (
		<span
			aria-hidden='true'
			className={twMerge('material-symbols-outlined', className)}
			{...props}>
			{children}
		</span>
	);
}
