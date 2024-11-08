import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function SelectDemo({ children, color }) {
	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (<CodeSection><rapid-select><rapid-option value="s">Small</rapid-option><rapid-option value="l" selected>Large</rapid-option></rapid-select></CodeSection >)
}
