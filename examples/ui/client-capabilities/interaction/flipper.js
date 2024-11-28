import { useRef } from 'react';
import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function FlipperDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const style = {
		marginRight: '4px',
		marginLeft: '4px',
	};

	return (
		<CodeSection>
			<rapid-flipper style={style} direction="previous"></rapid-flipper>
			<rapid-flipper style={style} direction="next"></rapid-flipper>
		</CodeSection >
	)
}
