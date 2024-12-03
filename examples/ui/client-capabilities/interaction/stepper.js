import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import './stepper.css';

export default function StepperDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<rapid-stepper onSubmit={() => alert('You completed form')}>
				<rapid-stepper-tab>Step 1</rapid-stepper-tab>
				<rapid-stepper-tab>Step 2</rapid-stepper-tab>
				<rapid-stepper-tab>Step 3</rapid-stepper-tab>
				<rapid-stepper-tab-panel>
					Tab Panel 1
				</rapid-stepper-tab-panel>
				<rapid-stepper-tab-panel>
					Tab Panel 2
				</rapid-stepper-tab-panel>
				<rapid-stepper-tab-panel>
					Tab Panel 3
				</rapid-stepper-tab-panel>
			</rapid-stepper>
		</CodeSection >
	)
}
