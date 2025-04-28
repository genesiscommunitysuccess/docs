import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useState } from 'react';

export default function CategorizedMultiselectDemo({inIndex = false}) {
	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const [selectedOptions, setSelectedOptions] = useState([])

	const options = [
		{
			type: "First category",
			value: 'First value',
			label: 'This is the first value',
			...(!inIndex ? { description:
    'Here you can add further information about each categorized multiselect item if you would like to',
			} : {})
		},
		{
			type: "Second category",
			value: 'Second value',
			label: 'This is the second value',
		},
		{
			type: "Second category",
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
		{!inIndex && <p style={{color: 'white'}}>Click the button to open the Categorized Multiselect</p>}
		<rapid-categorized-multiselect options={options} style={{width: '50%'}} onselectionChange={selectionChange} selectedOptions={selectedOptions}>
		</rapid-categorized-multiselect>
	</CodeSection >)
}
