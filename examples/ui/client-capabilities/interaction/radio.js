import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function RadioDemo({ children, color }) {
	return (
		<CodeSection>
			<rapid-radio>Radio</rapid-radio>
		</CodeSection>)
}
