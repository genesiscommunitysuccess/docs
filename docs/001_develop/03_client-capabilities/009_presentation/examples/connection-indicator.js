import { CodeSection } from "../../../../../examples/ui/documentationBase.js";
import useIsBrowser from "@docusaurus/useIsBrowser";
import {useRef} from "react";

function setup() {
	// Setup
	const isBrowser = useIsBrowser();
	if (isBrowser) {
		const RapidImports = require("../../../../../examples/ui/rapidImports");
		RapidImports.registerComponents();
	}
}

export default function ConnectionIndicatorDemo({ children, color }) {
	setup();
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '200px', flexDirection: 'column', }}>
					<rapid-connection-indicator show-label>
					</rapid-connection-indicator>
				</div>
			</div>
		</CodeSection>
	)
}
