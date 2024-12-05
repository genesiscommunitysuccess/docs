import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function CheckboxDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (<CodeSection><CodeLabel>Checkbox:</CodeLabel>
		<div style={{color: 'var(--neutral-foreground-rest)'}}>
			<div>
				<div>Default checkbox</div>
				<rapid-checkbox></rapid-checkbox>
			</div>
			<div>
				<div>Checkbox with slotted label</div>
				<rapid-checkbox>Check me!</rapid-checkbox>
			</div>
			<div>
				<div>Disabled checkbox</div>
				<rapid-checkbox disabled></rapid-checkbox>
			</div>
		</div>
	</CodeSection >)
}
