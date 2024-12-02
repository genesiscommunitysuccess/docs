import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

function setup() {
	// Setup
	const isBrowser = useIsBrowser();
	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}
}

export default function NumberFieldDemo({ children, color }) {
	setup();
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<rapid-number-field value="1"></rapid-number-field>
				</div>
			</div>
		</CodeSection>
	)
}
