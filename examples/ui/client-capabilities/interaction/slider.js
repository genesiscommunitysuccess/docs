import { CodeLabel, CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function SliderDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const thumbStyles = {
		height: '30px',
		width: '30px',
		borderRadius: '50%',
		background: 'red',
		fontSize: '10px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '-6px 0 0 -6px'
	}

	return (
		<CodeSection>
			<CodeLabel>Slider:</CodeLabel>
			<div style={{ width:'100%', padding:'30px', color: 'var(--neutral-foreground-rest)'}}>
				<div>
					<label>Simple slider</label>
					<rapid-slider></rapid-slider>
				</div>
				<div style={{ height: '200px' }}>
					<label>Vertical slider</label>
					<rapid-slider orientation="vertical">
					</rapid-slider>
				</div>
				<div>
					<label>Simple slider with slots</label>
					<rapid-slider>
						<div slot="thumb" style={thumbStyles}>bps</div>
					</rapid-slider>
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
