import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useEffect, useRef, useState } from 'react';
import {Serialisers} from "@genesislcap/foundation-criteria";
export default function SegmentedControlDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const segmentedControlRef = useRef(null);

	const [outputValue, setOutputValue] = useState('');

	useEffect(() => {

	}, []);

	const handleChange = (event) => {
		setOutputValue(event.target.value);
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<rapid-segmented-control ref={segmentedControlRef} onClick={handleChange}>
						<rapid-segmented-item>Item 1</rapid-segmented-item>
						<rapid-segmented-item>Item 2</rapid-segmented-item>
						<rapid-segmented-item>Item 3</rapid-segmented-item>
					</rapid-segmented-control>
				</div>
			</div>
		</CodeSection>
	)
}
