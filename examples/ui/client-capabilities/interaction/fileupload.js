import { CodeLabel, CodeSection } from '../../documentationBase';
import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';


export default function FileUploadDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			{ isBrowser && <rapid-file-upload
				label="File Upload (JSON files only)"
				filesGridColumnDefinitions={["col1"]}
				accept="application/json">
			</rapid-file-upload>
			}
		</CodeSection >
	)
}
