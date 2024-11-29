import useIsBrowser from '@docusaurus/useIsBrowser';
import CardList from '@site/src/components/Card/CardList';

import AccordionDemo from '/examples/ui/client-capabilities/interaction/accordion.js';

const cardData = [
{
  "heading": "Accordion",
  "link": "/develop/client-capabilities/interaction/client-interaction-accordion/",
  "text": "Expandable and collapsible sections",
	children: <AccordionDemo />,
},
{
  "heading": "Server communications",
  "link": "/develop/client-capabilities/server-communications/",
  "text": "Server Communications description",
  "imageUrl": "/svg/categories-icons/set-up-svgrepo-com.svg"
},
{
  "heading": "Server communications",
  "link": "/develop/client-capabilities/server-communications/",
  "text": "Server Communications description",
  "imageUrl": "/svg/categories-icons/set-up-svgrepo-com.svg"
},
{
  "heading": "Server communications",
  "link": "/develop/client-capabilities/server-communications/",
  "text": "Server Communications description",
  "imageUrl": "/svg/categories-icons/set-up-svgrepo-com.svg"
},
{
  "heading": "Server communications",
  "link": "/develop/client-capabilities/server-communications/",
  "text": "Server Communications description",
  "imageUrl": "/svg/categories-icons/set-up-svgrepo-com.svg"
},
]

export default function LayoutExample({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../../../examples/ui/rapidImports');
		RapidImports.registerComponents();
	}

  return (
      <CardList
        xs="12"
        sm="6"
        md="6"
        items={cardData}
      />
  );
	return (
			<div>Test</div>
	);
}
