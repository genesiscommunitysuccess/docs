import {CodeLabel, CodeSection} from "../../../../../examples/ui/documentationBase.js";
import useIsBrowser from "@docusaurus/useIsBrowser";
import React, { useEffect, useRef, useState } from 'react';
import { DefaultJSONSerializer } from '@genesislcap/foundation-utils';

function setup() {
	// Setup
	const isBrowser = useIsBrowser();
	if (isBrowser) {
		const RapidImports = require("../../../../../examples/ui/rapidImports");
		RapidImports.registerComponents();
	}
}

export default function SerializerDemo({ children, color }) {
	setup();

	const [outputValue, setOutputValue] = useState('');
	const [outputValue2, setOutputValue2] = useState('');

	const toggleStandard = (event) => {
		setOutputValue('here Standard');
	}

	const toggleEnhanced = (event) => {
		const object = { date: new Date(), bigNumber: BigInt(12345678901234567890) };
		const serializer = new DefaultJSONSerializer();
		const jsonString = serializer.serialize(object);
		setOutputValue2(jsonString);
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
					<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
						<rapid-button
							onClick={toggleStandard}
						>
							Standard Serialize
						</rapid-button>
						<rapid-text-field
							readOnly
							value={outputValue}
							placeholder="Generated expression outpu1t."
						>
							<label slot="label">JSONSerializer Output:</label>
						</rapid-text-field>
					</div>

					<rapid-divider></rapid-divider>

					<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
						<rapid-button
							onClick={toggleEnhanced}
						>
							JSONSerialize
						</rapid-button>
						<rapid-text-field
							readOnly
							value={outputValue2}
							placeholder="Generated expression outpu1t."
						>
							<label slot="label">JSONSerializer Output:</label>
						</rapid-text-field>
					</div>
				</div>
			</div>
		</CodeSection>
	)
}
