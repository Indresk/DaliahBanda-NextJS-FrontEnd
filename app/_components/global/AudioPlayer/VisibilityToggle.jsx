import Button from '@/frontend/components/buttons/GeneralButton';

export default function VisibilityToggle({ visible, onToggle }) {
	return (
		<Button
			size='noPadding'
			variant={visible ? 'ghost' : 'primary'}
			onClick={onToggle}
			className={`absolute ${visible ? 'top-0' : '-top-6'} right-0`}>
			<span className='material-symbols-outlined'>
				{visible ? 'close' : 'arrow_upward'}
			</span>
		</Button>
	);
}
