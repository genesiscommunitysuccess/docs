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
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', height: '75px', width: '100%', flexDirection: 'column', }}>
					<div>
						<rapid-icon name="house"></rapid-icon>
						<rapid-icon name="user" variant="regular"></rapid-icon>
						<rapid-icon name="github" variant="brand"></rapid-icon>
					</div>
				</div>
			</div>
		</CodeSection>
	)
}
