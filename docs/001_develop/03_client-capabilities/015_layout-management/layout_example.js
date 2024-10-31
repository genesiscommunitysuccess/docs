import { registerComponents } from '../../../../examples/ui/rapidImports';

registerComponents();

export default function LayoutExample({ children, color }) {
	return (
		<div style={{ width: "600px", height: "500px" }}>
			<rapid-layout>
				<rapid-layout-region>
					<rapid-layout-region type="vertical">
						<rapid-layout-item title="Button">
							<rapid-button>Rapid Button</rapid-button>
						</rapid-layout-item>
						<rapid-layout-item title="Checkbox">
							<rapid-checkbox>Rapid Checkbox</rapid-checkbox>
						</rapid-layout-item>
					</rapid-layout-region>
					<rapid-layout-item title="Text">
						<p style={{color: '#FFFFFF'}}>Hello World</p>
					</rapid-layout-item>
				</rapid-layout-region>
			</rapid-layout>
		</div>
	);
}
