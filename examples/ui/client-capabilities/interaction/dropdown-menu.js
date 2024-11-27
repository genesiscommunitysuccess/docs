import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { DropdownMenuItem } from '@genesislcap/rapid-design-system';
import { useEffect, useRef } from 'react';

export default function DropdownMenuDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const dropdownMenu = useRef(null);

	const setOfItems = [
		{
			name: 'Menu item 1',
			callback: () => alert('Menu item 1 clicked'),
			icon: {
				name: 'glasses',
			},
		},
		{
			name: 'Menu item 3',
			callback: () => alert('Menu item 3 clicked'),
			submenu: [
				{
					name: 'Menu item 5',
					callback: () => alert('Menu item 5 clicked'),
					color: 'red',
					icon: {
						name: 'address-card',
					},
				},
			]
		},
		{
			name: 'Menu item 4',
			callback: () => logger.debug('Menu item 4 clicked'),
			isDisabled: () => true,
		},
	];

	useEffect(() => {
		dropdownMenu.current.items = setOfItems;
	}, []);

	return (
		<CodeSection>
			<rapid-dropdown-menu ref={dropdownMenu}></rapid-dropdown-menu>
		</CodeSection>)
}
