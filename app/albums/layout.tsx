import BreadCrumb from './_components/BreadCrumb';

export default function AlbumsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='flex h-full'>
			<BreadCrumb />
			<>{children}</>
		</div>
	);
}
