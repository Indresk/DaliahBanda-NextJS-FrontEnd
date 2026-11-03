'use client';

import dynamic from 'next/dynamic';

// SunEditor necesita el navegador (no se renderiza en el servidor) y pesa bastante: se carga aparte,
// solo en las pantallas que lo usan. `dynamic` va a nivel de módulo: dentro del componente se
// recrearía en cada render y el editor se desmontaría y volvería a crear.
const Editor = dynamic(() => import('./BaseTextEditor'), {
	ssr: false,
	loading: () => <div className='min-h-80 animate-pulse bg-black' aria-busy='true' />,
});

export default function EditorLoader(props) {
	return <Editor {...props} />;
}
