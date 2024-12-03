import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function ToolbarDemo({ inIndex = false }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const styles = inIndex ? {minWidth: '0px', marginBottom: '50px', width: '100%'} : {}

	return (
		<CodeSection>
			<rapid-toolbar>
				<rapid-button>Button</rapid-button>
				<rapid-select position="below" style={styles}>
					<rapid-option>Option 1</rapid-option>
					<rapid-option>Second option</rapid-option>
					{!inIndex ? <rapid-option>Option 3</rapid-option> : null}
				</rapid-select>
				<rapid-radio-group>
					<rapid-radio checked="">One</rapid-radio>
					<rapid-radio>Two</rapid-radio>
					{!inIndex ? <rapid-radio>Three</rapid-radio> : null}
				</rapid-radio-group>
			</rapid-toolbar>
		</CodeSection >
	)
}
