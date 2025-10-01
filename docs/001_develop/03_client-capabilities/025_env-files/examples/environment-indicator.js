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

export default function EnvironmentIndicatorDemo({ children, color }) {
	setup();
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '200px', flexDirection: 'column', }}>
					<rapid-environment-indicator
						level="dev"
						label="DEVELOPMENT"
						background-color="#ff6b35"
						text-color="#ffffff"
						show-icon="true"
						icon="code"
						size="lg"
					></rapid-environment-indicator>
				</div>
			</div>
		</CodeSection>
	)
}
