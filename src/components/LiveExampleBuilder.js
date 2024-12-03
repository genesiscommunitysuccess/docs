import useIsBrowser from '@docusaurus/useIsBrowser';
import CardList from '@site/src/components/Card/CardList';
import LoadingRing from '@site/src/components/Card/LoadingRing';
import {useState, useEffect} from 'react';

export default function LiveExampleBuilder({ itemData }) {
  const isBrowser = useIsBrowser();
  const [isLoading, setIsLoading] = useState(true);

	const processedItems = itemData.map((item) => ({
		...item,
		...(item.children ? {children: {...item.children, props: {inIndex: true}}} : {}),
	}))

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isBrowser) {
    const RapidImports = require('../../examples/ui/rapidImports');
    RapidImports.registerComponents();
  }

  return (
    <>
      {isLoading ? (
		<LoadingRing />
      ) : (
			<>
					<p style={{textAlign: 'center'}}>Here is an index of components in this section. You can interact
						with the live examples below, or click the card to navigate to the documentation.</p>
        <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
          <CardList
            xs="12"
            sm="6"
            md="4"
            items={processedItems}
          />
        </div>
      </>) }
    </>
  );
}

