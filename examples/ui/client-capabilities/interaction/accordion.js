import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function AccordionDemo({ children, color }) {

  const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available', height: '180px'}}>
				<rapid-accordion>
					<rapid-accordion-item expanded>
							<span slot="heading">Panel one</span>
							Panel one content
					</rapid-accordion-item>
					<rapid-accordion-item>
							<span slot="heading">Panel two</span>
							Panel two content
					</rapid-accordion-item>
					<rapid-accordion-item expanded>
							<span slot="heading">Panel three</span>
							Panel three content
					</rapid-accordion-item>
				</rapid-accordion>
			</div>
		</CodeSection>)
}
