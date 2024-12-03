import {CodeLabel, CodeSection} from "../../../../../examples/ui/documentationBase.js";
import useIsBrowser from "@docusaurus/useIsBrowser";
import React, { useEffect, useRef, useState } from 'react';
import { DefaultJSONSerializer, defaultJSONSerializerConfig, JSONSerializer } from '@genesislcap/foundation-utils';
import { DI } from '@genesislcap/web-core';

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

	const dateObject = { date: new Date()};
	const object = { date: new Date(), bigNumber: BigInt(12345678901234567890) };

	const toggleStandard = (event) => {
		const jsonString = JSON.stringify(dateObject);
		setOutputValue(jsonString);
	}

	const toggleEnhanced = (event) => {

		let replacer = function(key, value) {
			if (this[key] instanceof Date) {
				return this[key].toUTCString();
			}
			return value;
		}

		const CustomJSONSerializerConfig = {
			parse: (input) => parse(input, null, customNumberParser),
			stringify: (object) => stringify(object, replacer),
		};

		const serializer = DI.getOrCreateDOMContainer().get(JSONSerializer(CustomJSONSerializerConfig));

		const jsonString = serializer.serialize(dateObject);
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
							placeholder="Output"
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
							placeholder="Output"
						>
							<label slot="label">JSONSerializer Output:</label>
						</rapid-text-field>
					</div>
				</div>
			</div>
		</CodeSection>
	)
}
