import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
export default function TextAreaDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}
	
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<rapid-text-area maxlength='20' placeholder='Try to type more than 20 characters.' rows='3' cols='10'>Sample text area with maxlength 20 and three rows.</rapid-text-area>
					<rapid-text-area resize='both' placeholder='Drag text are from bottom right to resize.'>Sample text area with resize both set</rapid-text-area>
				</div>
			</div>
		</CodeSection>
	)
}
