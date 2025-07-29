import { CodeSection } from "@site/examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './submenu_header_example.css';

export default function SubmenuHeaderExample() {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    const RapidImports = require("@site/examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  const logoUrl = useBaseUrl('/img/logo-icon--light.svg');

  const navItems = [
    {
      path: 'fx',
      element: async () => {},
      title: 'FX',
      name: 'fx',
      navId: "header",
      settings: { autoAuth: true },
      navItems: [
        { title: 'FX Cash', routePath: 'grids/fx-cash' },
        { title: 'FX Options', routePath: 'grids/fx-options' },
        {
          title: 'Request Price',
          onClick: () => {
            console.log('Requesting for price');
          },
        },
      ],
    },
    {
      path: 'grids/fx-cash',
      title: 'FX Cash',
      element: async () => {},
    },
    {
      path: 'grids/fx-options',
      title: 'FX Options',
      element: async () => {},
    },
  ];

  return (
    <CodeSection>
      <foundation-header
        className="submenu-header-example"
        logo-src={logoUrl}
        routeNavItems={navItems}
      ></foundation-header>
    </CodeSection>
  );
}
