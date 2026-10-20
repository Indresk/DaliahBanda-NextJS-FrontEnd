const STATUS_STYLES = {
	ok: 'text-emerald-400',
	error: 'text-red-400',
	uploading: 'text-lightgray',
};

// Estado de cada archivo de una subida (ver useAssetUploads): mensaje y barra de progreso
export default function UploadProgressList({ items }) {
	if (items.length === 0) return null;

	return (
		<ul role='status' className='flex flex-col gap-2 text-xs'>
			{items.map((item, index) => (
				<li key={`${item.name}-${index}`}>
					<span className={STATUS_STYLES[item.status]}>
						{item.name}: {item.message}
					</span>
					{item.status === 'uploading' && (
						<progress
							value={item.progress}
							max={100}
							aria-label={`Progreso de ${item.name}`}
							className='mt-1 block h-1 w-full accent-primary'
						/>
					)}
				</li>
			))}
		</ul>
	);
}
