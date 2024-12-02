import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function ButtonDemo({ children, color }) {

  const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
				<rapid-button>
					Default Button
				</rapid-button>
				<rapid-button appearance="primary">
					Primary Color Button
				</rapid-button>
				<rapid-button appearance="secondary">
					Secondary Color Button
				</rapid-button>
				<rapid-button>
					<rapid-icon name="plus" slot="start"></rapid-icon>
					Button with start slot
				</rapid-button>
				<rapid-button>
					Button with end slot
					<rapid-icon name="warning" slot="end"></rapid-icon>
				</rapid-button>
				<rapid-button disabled>
					Disabled Button
				</rapid-button>
			</div>

		</CodeSection>)
}
