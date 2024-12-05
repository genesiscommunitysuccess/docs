import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function SelectDemo({inIndex = false}) {
	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const styles = inIndex ? {minWidth: '0px', width: '100%', marginBottom: '100px'} : {}

	return (<CodeSection><rapid-select position="below" style={styles}><rapid-option value="s">Small</rapid-option><rapid-option value="l" selected>Large</rapid-option></rapid-select></CodeSection >)
}
