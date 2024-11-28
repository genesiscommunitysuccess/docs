import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { MenuItem } from '@genesislcap/rapid-design-system';

export default function MenuDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const handleChange = (e) => {
		console.log(e.target)
	}

	return (
		<CodeSection>
			<rapid-menu onChange={(e) => handleChange(e)}>
				<rapid-menu-item>Menu item 1</rapid-menu-item>
				<rapid-menu-item>Menu item 2</rapid-menu-item>
				<rapid-menu-item>Menu item 3</rapid-menu-item>
				<rapid-divider></rapid-divider>
				<rapid-menu-item role="menuitemradio">Menu item 4</rapid-menu-item>
				<rapid-menu-item role="menuitemradio">Menu item 5</rapid-menu-item>
			</rapid-menu>
		</CodeSection >
	)
}
