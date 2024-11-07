import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function StepperDemo({ children, color }) {
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
