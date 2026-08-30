import BreadCrumb from './_components/BreadCrumb';

export default function AlbumsLayout({ children }) {
	return (
		<div className='flex h-full'>
			<BreadCrumb />
			<>{children}</>
		</div>
	);
}
