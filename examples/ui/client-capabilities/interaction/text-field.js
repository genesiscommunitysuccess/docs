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

export default function TextFieldDemo({ children, color }) {
	setup();
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<rapid-text-field placeholder="Sample text" type="text">Text Field</rapid-text-field>
				</div>
			</div>
		</CodeSection>
	)
}

// assumes setup has been called via TextFieldDemo
export function TextFieldWithSlot({ children, color }) {
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
						<rapid-text-field type="text" inputmode="numeric" pattern="\d*">
						<div slot="start">
							$
						</div>
					</rapid-text-field>
				</div>
			</div>
		</CodeSection>
	)
}

