import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function SwitchDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (<CodeSection><CodeLabel>Switch:</CodeLabel><rapid-switch></rapid-switch></CodeSection >)
}
