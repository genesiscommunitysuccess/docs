import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useState } from 'react';

export default function MultiselectDemo({inIndex = false}) {
	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const [selectedOptions, setSelectedOptions] = useState([])

	const options = [
		{
			value: 'First value',
			label: 'This is the first value',
		},
		{
			value: 'Second value',
			label: 'This is the second value',
		},
		{
			value: 'Third value',
			label: "This is the third value, and it's disabled",
			disabled: true,
		},
	]

	const selectionChange = (e) => {
		console.log(e.detail)
		setSelectedOptions(e.detail)
	}

	return (<CodeSection>
		<rapid-multiselect options={options} style={{width: '50%'}} onselectionChange={selectionChange} selectedOptions={selectedOptions}>
		</rapid-multiselect>
	</CodeSection >)
}
