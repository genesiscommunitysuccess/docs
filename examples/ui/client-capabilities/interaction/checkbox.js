import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function CheckboxDemo({ children, color }) {
	return (<CodeSection><CodeLabel>Checkbox:</CodeLabel><rapid-checkbox></rapid-checkbox></CodeSection >)
}
