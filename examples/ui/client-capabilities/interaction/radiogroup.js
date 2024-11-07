import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function RadioGroupDemo({ children, color }) {
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
