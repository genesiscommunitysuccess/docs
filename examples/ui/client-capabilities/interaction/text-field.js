import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function TextFieldDemo({ children, color }) {
	return (<CodeSection><rapid-text-field placeholder="Input text here">Sample Text Field</rapid-text-field></CodeSection >)
}
