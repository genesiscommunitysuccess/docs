import { CodeLabel, CodeSection } from '../../documentationBase';
import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';


export default function FileUploadDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const rapidFileUpload = useRef(null);

	useEffect(() => {
		rapidFileUpload.current.filesGridColumnDefinitions = ["col1"];
	}, []);

	return (
		<CodeSection>
			<rapid-file-upload
				label="File Upload (JSON files only)"
				ref={rapidFileUpload}
				accept="application/json">
			</rapid-file-upload>
		</CodeSection >
	)
}
