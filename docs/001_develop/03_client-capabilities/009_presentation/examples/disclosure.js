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

export default function DisclosureDemo({ children, color }) {
	setup();

	const bannerRef = useRef(null);

	const dismissBanner = (e) => {
		bannerRef.current?.dismiss();
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', height: '175px', width: '100%', flexDirection: 'column', }}>
					<rapid-disclosure appearance="lightweight">
						<strong slot="title">Read about Foundation UI</strong>
						<div>
							Foundation UI is a collection of technologies built on Web Components and modern Web Standards, designed to help you
							efficiently tackle some of the most common challenges in website and application design and development.
						</div>
					</rapid-disclosure>
				</div>
			</div>
		</CodeSection>
	)
}
