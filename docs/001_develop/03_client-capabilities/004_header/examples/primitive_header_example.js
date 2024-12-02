import { CodeSection } from "@site/examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './primitive_header_example.css';

export default function PrimitiveHeaderExample() {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    const RapidImports = require("@site/examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  const logoUrl = useBaseUrl('/img/logo-icon--light.svg');

  const navItems = [{
    title: "Home",
    icon: {
      name: "home",
      variant: "solid",
    },
    navId: "header",
    placementIndex: 0,
    routePath: "home",
    routeName: "home",
  },
  {
    title: "Grids",
    icon: {
        name: "table",
        variant: "solid",
      },
    navId: "header",
    placementIndex: 10,
    routePath: "grids",
    routeName: "grids",
  }];

  return (
    <CodeSection>
      <foundation-header
        className="primitive-header-example"
        logo-src={logoUrl}
        routeNavItems={navItems}
      ></foundation-header>
    </CodeSection>
  );
}
