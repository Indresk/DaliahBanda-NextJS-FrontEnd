import Button from '@/frontend/components/buttons/GeneralButton';
import MSOIcon from '@/frontend/assets/icons/MSOIcon';

export default function VisibilityToggle({ visible, onToggle }) {
	return (
		<Button
			size='noPadding'
			variant={visible ? 'ghost' : 'primary'}
			onClick={onToggle}
			className={`absolute ${visible ? 'top-0' : '-top-6'} right-0`}>
			<MSOIcon>{visible ? 'close' : 'arrow_upward'}</MSOIcon>
		</Button>
	);
}
