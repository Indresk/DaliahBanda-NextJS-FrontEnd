// Etiqueta + control + ayuda opcional de un formulario. `children` es el input/select.
export default function Field({ label, htmlFor, hint, className = '', children }) {
	return (
		<div className={`flex flex-col gap-1 ${className}`}>
			<label htmlFor={htmlFor} className='text-sm text-lightgray'>
				{label}
			</label>
			{children}
			{hint && <p className='text-xs text-lightgray'>{hint}</p>}
		</div>
	);
}

// Clases de los controles de formulario del dashboard
export const controlClass = 'w-full bg-black px-3 py-2 text-sm';
