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
			<rapid-tree-view style={{minWidth: '200px'}}>
				Root
				<rapid-tree-item>
					Item 1
					<rapid-tree-item>Sub-item 1-1</rapid-tree-item>
					<rapid-tree-item>Sub-item 1-2</rapid-tree-item>
					<rapid-tree-item>
						Item 2
						<rapid-tree-item>Sub-item 2-1</rapid-tree-item>
						<rapid-tree-item>Sub-item 2-2</rapid-tree-item>
					</rapid-tree-item>
				</rapid-tree-item>
				<rapid-tree-item>Item 3</rapid-tree-item>
			</rapid-tree-view>
		</CodeSection >
	)
}
