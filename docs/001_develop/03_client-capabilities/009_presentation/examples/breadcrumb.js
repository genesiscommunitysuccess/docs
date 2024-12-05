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

export default function BreadcrumbDemo({ children, color }) {
	setup();

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: 'width: 100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', height: '55px', width: '100%', flexDirection: 'column', }}>
					<rapid-breadcrumb>
						<rapid-breadcrumb-item href="#">Breadcrumb item 1</rapid-breadcrumb-item>
						<rapid-breadcrumb-item href="#">Breadcrumb item 2</rapid-breadcrumb-item>
						<rapid-breadcrumb-item>Breadcrumb item 3</rapid-breadcrumb-item>
					</rapid-breadcrumb>
				</div>
			</div>
		</CodeSection>
	)
}
