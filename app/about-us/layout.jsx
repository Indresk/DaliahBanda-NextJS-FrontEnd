// `breadcrumb` es el slot paralelo @breadcrumb: cada ruta pinta sus migas con los títulos reales
export default function AboutUsLayout({ children, breadcrumb }) {
	return (
		<div className='flex h-full'>
			{breadcrumb}
			<div className='min-w-0 flex-1'>{children}</div>
		</div>
	);
}
