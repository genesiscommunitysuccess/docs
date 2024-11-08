import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function RadioGroupDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
					<CodeSection>
						<CodeLabel>RadioGroup:</CodeLabel>
						<rapid-radio-group>
							<rapid-radio value="one">One</rapid-radio>
							<rapid-radio value="two">Two</rapid-radio>
							<rapid-radio value="three">Three</rapid-radio>
						</rapid-radio-group>
					</CodeSection>
					)
}
