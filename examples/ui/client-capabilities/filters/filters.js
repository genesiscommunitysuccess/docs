import { CodeLabel, CodeSection } from '../../documentationBase';
import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { timeWindowFilter } from '@genesislcap/foundation-filters';
export default function FiltersDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const result = useRef(null);

    const checkTimeWindow = () => {
        result.current.textContent = timeWindowFilter(startDateRef.current.value, endDateRef.current.value)? 'Exists within the start and end period': 'Doesnot fall between start and end period';
    }

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
                    <rapid-text-field  type="datetime-local" ref={startDateRef}> Start Period</rapid-text-field>
                    <rapid-text-field  type="datetime-local" ref={endDateRef}>End Period</rapid-text-field>
                    <rapid-button onClick={() => checkTimeWindow()}>Check</rapid-button>
                    <span style={{ height: '20px' }} ref={result} ></span>
				</div>
			</div>
		</CodeSection>
	)
}
