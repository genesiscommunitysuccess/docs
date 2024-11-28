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

export default function SkeletonDemo({ children, color }) {
	setup();
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<rapid-skeleton
						style={{
							height: '70px',
							width: '70px',
						}}
						shape="rect"
						pattern="/svg/skeleton-test-pattern.svg"
						shimmer>
					</rapid-skeleton>
				</div>
			</div>
		</CodeSection>
	)
}
