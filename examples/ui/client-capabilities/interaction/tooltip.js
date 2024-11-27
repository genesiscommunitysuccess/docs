import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { MenuItem } from '@genesislcap/rapid-design-system';

export default function TooltipMenu({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<div style={{height: '50px'}}>
				<rapid-button id="anchor">Hover me</rapid-button>
				<rapid-tooltip anchor="anchor">
					<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '50px', flexDirection: 'column', }}>
							<rapid-avatar shape="circle" fill="green" color="black">JD</rapid-avatar>
						</div>
					</div>
					<p style={{color: 'white',width: '200px'}}>Tooltip text</p>
				</rapid-tooltip>
			</div>
		</CodeSection >
	)
}
