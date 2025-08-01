import { CodeLabel, CodeSection } from '../../documentationBase';
import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';


export default function FileReaderDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			{ isBrowser && <rapid-file-reader
				label="Select JSON File"
				accept=".json,application/json"
				file-size-limit-bytes="10485760"
				auto-process="false"
				processing-delay-ms="1000"
				onFileRead={(event) => {
					console.log('File processed:', event.detail);
				}}
				onError={(event) => {
					console.error('File processing error:', event.detail);
				}}
				onClear={() => {
					console.log('File cleared');
				}}
			>
			</rapid-file-reader>
			}
		</CodeSection >
	)
} 
