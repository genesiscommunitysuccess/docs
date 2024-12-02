import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function SliderDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<CodeLabel>Slider:</CodeLabel>
			<div style={{ width:'100%', padding:'30px', color: 'var(--neutral-foreground-rest)'}}>
				<div>
					<label>Simple slider</label>
					<rapid-slider></rapid-slider>
				</div>
				<div>
					<label>Slider with labels and step value of 1</label>
					<rapid-slider min="0" max="100" step="1" value="50">
						<rapid-slider-label position="0"> Low </rapid-slider-label>
						<rapid-slider-label position="50"> Mid </rapid-slider-label>
						<rapid-slider-label position="100"> High </rapid-slider-label>
					</rapid-slider>
				</div>
			</div>
		</CodeSection >
	)
}
