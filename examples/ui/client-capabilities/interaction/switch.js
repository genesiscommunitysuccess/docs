import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function SwitchDemo({ children, color }) {
	return (<CodeSection><CodeLabel>Switch:</CodeLabel><rapid-switch></rapid-switch></CodeSection >)
}
