import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function ButtonDemo({ children, color }) {
	return (
		<CodeSection>
			<rapid-button>
				Button
			</rapid-button>
		</CodeSection>)
}
