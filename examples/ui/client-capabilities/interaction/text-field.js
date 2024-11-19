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
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<rapid-text-field placeholder="Sample text" type="text">Text Field</rapid-text-field>
				</div>
			</div>
		</CodeSection>
	)
}

const styles = {
	color: 'var(--neutral-foreground-rest)',
	width: '-webkit-fill-available',
	display: 'flex',
	flexWrap: 'wrap',
	gap: '10px',
	flexDirection: 'column',
}

// assumes setup has been called via TextFieldDemo
export function TextFieldWithSlot({ children, color }) {
	return (
		<CodeSection>
			<div style={styles}>
				<div>
					<label>Simple text field</label>
					<rapid-text-field type="text">
					</rapid-text-field>
				</div>
				<div>
					<label>Number field with start slot</label>
					<rapid-text-field type="number">
						<div slot="start">$</div>
					</rapid-text-field>
				</div>
				<div>
					<label>Text field with end slot</label>
					<rapid-text-field type="text">
						<div slot="end">%</div>
					</rapid-text-field>
				</div>
				<div>
					<label>Text field with placeholder</label>
					<rapid-text-field type="text" placeholder="Enter text here">
					</rapid-text-field>
				</div>
				<div>
					<label>Disabled text field</label>
					<rapid-text-field type="text" disabled>
					</rapid-text-field>
				</div>
			</div>
		</CodeSection>
	)
}

