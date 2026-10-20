// `breadcrumb` es el slot paralelo @breadcrumb: cada ruta pinta sus migas con los títulos reales
export default function AlbumsLayout({ children, breadcrumb }) {
	return (
		<div className='flex h-full'>
			{breadcrumb}
			<>{children}</>
		</div>
	);
}
