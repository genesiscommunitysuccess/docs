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

	const [outputValue, setOutputValue] = useState('Generated Expression Here');
	const yo = useRef(null);

	useEffect(() => {
		segmentedControlRef.current.criteriaOptions = [
			{ label: 'A', field: 'INSTRUMENT_ID', value: 'id1', serialiser: Serialisers.EQ },
			{ label: 'B', field: 'INSTRUMENT_ID', value: 'id2', serialiser: Serialisers.EQ },
			{ label: 'C', field: 'INSTRUMENT_ID', value: 'id3', serialiser: Serialisers.EQ },
		];
	}, []);

	const handleChange = (event) => {
		setOutputValue(event.target.value);
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<criteria-segmented-control ref={segmentedControlRef} onChange={handleChange}>
						<label slot="label">Select option</label>
					</criteria-segmented-control>
					<rapid-text-field value={outputValue}>
						Generated expression:
					</rapid-text-field>
				</div>
			</div>
		</CodeSection>
	)
}
