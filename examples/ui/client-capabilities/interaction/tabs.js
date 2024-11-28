import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { MenuItem } from '@genesislcap/rapid-design-system';

function ListItem({children}) {
	return (<li style={{color: 'white'}}>{children}</li>)
}

export default function MenuDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<rapid-tabs activeid="entrees">
				<rapid-tab id="apps">Appetizers</rapid-tab>
				<rapid-tab id="entrees">Entrees</rapid-tab>
				<rapid-tab id="desserts">Desserts</rapid-tab>
				<rapid-tab-panel id="appsPanel">
					<ol>
						<ListItem>Stuffed artichokes</ListItem>
						<ListItem>Bruschetta</ListItem>
					</ol>
				</rapid-tab-panel>
				<rapid-tab-panel id="entreesPanel">
					<ol>
						<ListItem>Tomato Bread Soup with Steamed Mussels</ListItem>
						<ListItem>Grilled Fish with Artichoke Caponata</ListItem>
					</ol>
				</rapid-tab-panel>
				<rapid-tab-panel id="dessertsPanel">
					<ol>
						<ListItem>Tiramisu</ListItem>
						<ListItem>limoncello and Ice Cream with Biscotti</ListItem>
					</ol>
				</rapid-tab-panel>
			</rapid-tabs>
		</CodeSection >
	)
}
