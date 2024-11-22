import { CodeSection } from '../../documentationBase';
import React, { useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function FiltersDemo({ children, color }) {
	const startDateRef = useRef(null);
	const endDateRef = useRef(null);
	const [outputValue, setOutputValue] = useState('');
	const [timeWindowFilter, setTimeWindowFilter] = useState(null);

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
		import('@genesislcap/foundation-filters').then(module => {
			setTimeWindowFilter(() => module.timeWindowFilter);
		});
	}

	const checkTimeWindow = () => {
		if (timeWindowFilter && startDateRef.current?.value && endDateRef.current?.value) {
			setOutputValue(timeWindowFilter(startDateRef.current.value, endDateRef.current.value) ? 'Current Date/Time exists within the start and end period' : "Current Date/Time doesn't fall between start and end period");
		}
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available' }}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<rapid-text-field type="datetime-local" ref={startDateRef}> Start Period</rapid-text-field>
					<rapid-text-field type="datetime-local" ref={endDateRef}>End Period</rapid-text-field>
					<rapid-button onClick={checkTimeWindow}>Check</rapid-button>
					<span style={{ height: '20px' }}>{outputValue}</span>
				</div>
			</div>
		</CodeSection>
	)
}