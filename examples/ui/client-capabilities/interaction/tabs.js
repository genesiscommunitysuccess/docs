import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

function ListItem({children}) {
	return (<li style={{color: 'white'}}>{children}</li>)
}

export default function MenuDemo({ inIndex = false }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<div style={{ width: '100%', margin: '10px', color: '#fff' }}>
				<h4 style={{ color: '#fff' }}>Primary style tabs</h4>
				<rapid-tabs activeid="entrees">
					<rapid-tab id="apps">Appetizers</rapid-tab>
					<rapid-tab id="entrees">Entrees</rapid-tab>
					{!inIndex ? (<rapid-tab id="desserts">Desserts</rapid-tab>) : null}
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
					{!inIndex ?
					(<rapid-tab-panel id="dessertsPanel">
						<ol>
							<ListItem>Tiramisu</ListItem>
							<ListItem>limoncello and Ice Cream with Biscotti</ListItem>
						</ol>
					</rapid-tab-panel>) : null}
				</rapid-tabs>
			</div>
			<div style={{ width: '100%', margin: '10px', color: '#fff' }}>
				<h4 style={{ color: '#fff' }}>Secondary style tabs</h4>
				<rapid-tabs activeid="entrees" appearance="secondary">
					<rapid-tab id="apps">Counterparties</rapid-tab>
					<rapid-tab id="entrees">Accounts</rapid-tab>
					<rapid-tab-panel id="appsPanel">
						<ol>
							<ListItem>Counterparty 1</ListItem>
							<ListItem>Counterparty 2</ListItem>
						</ol>
					</rapid-tab-panel>
					<rapid-tab-panel id="entreesPanel">
						<ol>
							<ListItem>First Bank Account</ListItem>
							<ListItem>Second Bank Account</ListItem>
						</ol>
					</rapid-tab-panel>
				</rapid-tabs>
			</div>
		</CodeSection >
	)
}
