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

export default function BannerDemo({ children, color }) {
	setup();

	const bannerRef = useRef(null);

	const dismissBanner = (e) => {
		bannerRef.current?.dismiss();
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', height: '75px', width: '100%', flexDirection: 'column', }}>
					<rapid-banner ref={bannerRef} onClick={dismissBanner}>
						<div slot="content">
							A banner for displaying information... Click to dismiss!
						</div>
					</rapid-banner>
				</div>
			</div>
		</CodeSection>
	)
}
