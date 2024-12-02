import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function ComboboxDemo({ children, color }) {
	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<rapid-combobox position="below">
				<rapid-option value="s">Small</rapid-option>
				<rapid-option value="m">Medium</rapid-option>
				<rapid-option value="l" selected>Large</rapid-option>
			</rapid-combobox>
		</CodeSection >
	)
}
