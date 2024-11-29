import { useRef } from 'react';
import { CodeSection } from "@site/examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './dynamic_routes_header_example.css';

const allRoutes = [
  { index: 0, path: '/home', variant: 'home', icon: 'home', title: 'Home' },
  { index: 1, path: '/profiles', variant: 'profile', icon: 'user', title: 'Profiles' },
  // Add more routes as needed
];

export default function DynamicRoutesHeaderExample() {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    const RapidImports = require("@site/examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  const logoUrl = useBaseUrl('/img/logo-icon--light.svg');
  const foundationHeaderRef = useRef(null);

  const navigateTo = (path) => {
    alert(`Navigating to ${path}`);
  };

  return (
    <CodeSection>
      <foundation-header
        ref={foundationHeaderRef}
        className="dynamic-routes-header-example"
        logo-src={logoUrl}
      >
          {allRoutes.map((route) => (
            <rapid-button
              slot="routes"
              key={route.index}
              appearance="neutral-grey"
              value={route.index}
              onClick={() => navigateTo(route.path)}
            >
              <rapid-icon variant={route.variant} name={route.icon}></rapid-icon>
              {route.title}
            </rapid-button>
          ))}
      </foundation-header>
    </CodeSection>
  );
}
