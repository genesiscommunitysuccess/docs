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

export default function HorizontalScrollDemo({ inIndex = false }) {
	setup();
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<rapid-horizontal-scroll style={{ width: '100%' }} flippers-hidden-from-at>
						<rapid-card>
							Card number 1
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 2
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 3
							<rapid-button>A button</rapid-button>
						</rapid-card>
						{!inIndex ?
						(<><rapid-card>
							Card number 4
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 5
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 6
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 7
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 8
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 9
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 10
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 11
							<rapid-button>A button</rapid-button>
						</rapid-card>
						<rapid-card>
							Card number 12
							<rapid-button>A button</rapid-button>
						</rapid-card></>) : null}
					</rapid-horizontal-scroll>
				</div>
			</div>
		</CodeSection>
	)
}
