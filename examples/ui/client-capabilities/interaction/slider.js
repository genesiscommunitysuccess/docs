import { CodeLabel, CodeSection } from '../../documentationBase';
import { registerComponents } from '../../rapidImports';

registerComponents();

export default function SliderDemo({ children, color }) {
	return (<CodeSection><CodeLabel>Slider:</CodeLabel><rapid-slider></rapid-slider></CodeSection >)
}
