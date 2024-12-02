import { CodeSection } from "../../../../../examples/ui/documentationBase.js";
import useIsBrowser from "@docusaurus/useIsBrowser";

function setup() {
	// Setup
	const isBrowser = useIsBrowser();
	if (isBrowser) {
		const RapidImports = require("../../../../../examples/ui/rapidImports");
		RapidImports.registerComponents();
	}
}

export default function BadgeDemo({ children, color }) {
	setup();
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '50px', flexDirection: 'column', }}>
					<rapid-badge fill="primary" color="light">JD</rapid-badge>
				</div>
			</div>
		</CodeSection>
	)
}
