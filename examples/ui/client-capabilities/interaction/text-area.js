import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function TextAreaDemo({ children, color }) {
	return (<CodeSection><rapid-text-area maxlength="20" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" rows="10" cols="10">Text Area</rapid-text-area></CodeSection >)
}
