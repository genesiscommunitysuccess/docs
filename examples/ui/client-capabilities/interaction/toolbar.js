import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function ToolbarDemo({ children, color }) {
	return (
		<CodeSection>
			<rapid-toolbar>
				<rapid-button>Button</rapid-button>
				<rapid-select>
					<rapid-option>Option 1</rapid-option>
					<rapid-option>Second option</rapid-option>
					<rapid-option>Option 3</rapid-option>
				</rapid-select>
				<rapid-radio-group>
					<rapid-radio checked="">One</rapid-radio>
					<rapid-radio>Two</rapid-radio>
					<rapid-radio>Three</rapid-radio>
				</rapid-radio-group>
			</rapid-toolbar>
		</CodeSection >
	)
}
