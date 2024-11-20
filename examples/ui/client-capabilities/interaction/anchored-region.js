import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function AnchoredRegionDemo({ children, color }) {

  const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<div id="viewport" style={{minHeight: '50px', paddingTop: '20px'}}>
				<button id="anchor">
					Button is an anchor, defined first in the DOM
				</button>
				<rapid-anchored-region
					anchor="anchor"
					vertical-positioning-mode="locktodefault"
					vertical-default-position="top">
					This shows up above the button, even though it's after it in the DOM
				</rapid-anchored-region>
			</div>
		</CodeSection>)
}
