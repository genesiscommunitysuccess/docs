import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useRef, useState } from 'react';
export default function SegmentedControlDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const segmentedControlRef = useRef(null);

	const [outputValue, setOutputValue] = useState('');

	const handleChange = (event) => {
		setOutputValue(event.target.value);
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<rapid-segmented-control ref={segmentedControlRef} onClick={handleChange}>
						<rapid-segmented-item value="1">Item 1</rapid-segmented-item>
						<rapid-segmented-item value="2">Item 2</rapid-segmented-item>
						<rapid-segmented-item value="3">Item 3</rapid-segmented-item>
					</rapid-segmented-control>
					<rapid-text-field style={{ width: '180px', }}
						readOnly
						value={outputValue}>
						Chosen Option:
					</rapid-text-field>
				</div>
			</div>
		</CodeSection>
	)
}
