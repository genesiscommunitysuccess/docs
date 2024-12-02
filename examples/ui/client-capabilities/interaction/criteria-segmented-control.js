import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useEffect, useRef, useState } from 'react';
import {Serialisers} from "@genesislcap/foundation-criteria";
export default function CriteriaSegmentedControlDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const segmentedControlRef = useRef(null);

	const [outputValue, setOutputValue] = useState('');

	useEffect(() => {
		segmentedControlRef.current.criteriaOptions = [
			{ label: 'A', field: 'CHOSEN_OPTION', value: 'option-A', serialiser: Serialisers.EQ },
			{ label: 'B', field: 'CHOSEN_OPTION', value: 'option-B', serialiser: Serialisers.EQ },
			{ label: 'C', field: 'CHOSEN_OPTION', value: 'option-C', serialiser: Serialisers.EQ },
		];
	}, []);

	const handleChange = (event) => {
		setOutputValue(event.target.value);
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<criteria-segmented-control ref={segmentedControlRef} onClick={handleChange}>
						<label slot="label">Select option</label>
					</criteria-segmented-control>
					<rapid-text-field
						readOnly
						value={outputValue}
						placeholder="Generated expression output."
					>
						<label slot="label">Output:</label>
					</rapid-text-field>
				</div>
			</div>
		</CodeSection>
	)
}
