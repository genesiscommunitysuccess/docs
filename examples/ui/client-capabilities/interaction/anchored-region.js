import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function AnchoredRegionDemo({}) {

  const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<div id="viewport" style={{minHeight: '50px', paddingTop: '20px'}}>
				<button id="anchor" style={{marginTop: '70px'}}>
					Button is an anchor, defined first in the DOM
				</button>
				<rapid-anchored-region
					style={{color: 'white'}}
					anchor="anchor"
					vertical-positioning-mode="locktodefault"
					vertical-default-position="top">
					<p>Content after button in DOM</p>
				</rapid-anchored-region>
			</div>
		</CodeSection>)
}
