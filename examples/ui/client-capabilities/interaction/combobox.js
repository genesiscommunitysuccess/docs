import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function ComboboxDemo({ inIndex }) {
	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const styles = inIndex ? {minWidth: '0px', marginBottom: '100px'} : {}

	return (
		<CodeSection>
			<rapid-combobox position="below" style={styles}>
				<rapid-option value="s">Small</rapid-option>
				<rapid-option value="m">Medium</rapid-option>
				<rapid-option value="l" selected>Large</rapid-option>
			</rapid-combobox>
		</CodeSection >
	)
}
