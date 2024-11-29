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

export default function CardDemo({ children, color }) {
	setup();
	return (
		<CodeSection>
			<rapid-card>
				<h4>Card title</h4>
				<p>
					At purus lectus quis habitant commodo, cras. Aliquam malesuada velit a tortor. Felis orci tellus netus risus et
					ultricies augue aliquet.
				</p>
				<alpha-button>Learn more</alpha-button>
			</rapid-card>
		</CodeSection>
	)
}
