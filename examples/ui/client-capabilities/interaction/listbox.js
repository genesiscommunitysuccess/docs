import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function ListboxDemo({ children, color }) {
	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (<CodeSection>
		<rapid-listbox>
			<rapid-option>Apple</rapid-option>
			<rapid-option>Banana</rapid-option>
			<rapid-option>Strawberry</rapid-option>
		</rapid-listbox>
	</CodeSection >)
}
