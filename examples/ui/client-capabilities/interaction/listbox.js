import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useState } from 'react';

export default function ListboxDemo({ children, color }) {
	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const [selected, setSelected] = useState('');

	return (<CodeSection>
		<rapid-listbox onClick={(e) => setSelected(e.target.value)}>
			<rapid-option value="apple">Apple</rapid-option>
			<rapid-option value="banana">Banana</rapid-option>
			<rapid-option value="strawberry">Strawberry</rapid-option>
		</rapid-listbox>
		<p>Selected: {selected}</p>
	</CodeSection >)
}
