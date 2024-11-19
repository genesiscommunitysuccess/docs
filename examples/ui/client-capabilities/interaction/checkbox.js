import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function CheckboxDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (<CodeSection><CodeLabel>Checkbox:</CodeLabel><rapid-checkbox></rapid-checkbox></CodeSection >)
}
