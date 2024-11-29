import useIsBrowser from '@docusaurus/useIsBrowser';
import CardList from '@site/src/components/Card/CardList';

function Test({}) {
 return (<p>Test</p>);
}

const test = [
{
  "heading": "Server communications",
  "link": "/develop/client-capabilities/server-communications/",
  "text": "Server Communications description",
  "imageUrl": "/svg/categories-icons/set-up-svgrepo-com.svg",
	children: <Test />,
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
        sm="4"
        md="4"
        items={test}
      />
  );
	return (
			<div>Test</div>
	);
}
