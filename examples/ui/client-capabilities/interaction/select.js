import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function SelectDemo({ children, color }) {
	return (<CodeSection><rapid-select><rapid-option value="s">Small</rapid-option><rapid-option value="l" selected>Large</rapid-option></rapid-select></CodeSection >)
}
