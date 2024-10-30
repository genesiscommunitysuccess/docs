import { registerComponents } from '../../rapidImports';

registerComponents();

export default function CheckboxDemo({ children, color }) {
	return (<div><label id='checkbox' style={{ paddingRight: '5px' }}>Checkbox</label><rapid-checkbox aria-labelledby='checkbox'></rapid-checkbox></div >)
}
