import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function AnchorDemo({ children, color }) {

  const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const style = {
		marginLeft: '5px',
		marginRight: '5px'
	}

	return (
		<CodeSection>
			<rapid-anchor style={style} href="https://genesis.global/">External link</rapid-anchor>
			<rapid-anchor style={style} href="#api">Internal link</rapid-anchor>
			<rapid-anchor style={style} href="mailto:hello@genesis.global">Mail link</rapid-anchor>
		</CodeSection>)
}
