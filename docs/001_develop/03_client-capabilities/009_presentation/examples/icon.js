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

export default function IconDemo({ children, color }) {
	setup();
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)' }}>
				<div style={{ display: 'flex', flexWrap: 'wrap', height: '30px', width: '300px', flexDirection: 'column', }}>
					<div style={{ display: 'flex', flexWrap: 'wrap', width: '30px' }}>
						<rapid-icon name="house"></rapid-icon>
					</div>
					<div style={{ display: 'flex', flexWrap: 'wrap', width: '30px' }}>
						<rapid-icon name="user" variant="regular"></rapid-icon>
					</div>
						<rapid-icon name="github" variant="brand"></rapid-icon>
				</div>
			</div>
		</CodeSection>
	)
}
