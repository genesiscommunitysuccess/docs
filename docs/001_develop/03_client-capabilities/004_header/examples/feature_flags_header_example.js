import { CodeSection } from "@site/examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './feature_flags_header_example.css';

export default function FeatureFlagsHeaderExample() {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    const RapidImports = require("@site/examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  const logoUrl = useBaseUrl('/img/logo-icon--light.svg');

  const featureFlagOptions = {
    availableFlags: [
      { name: 'ai', label: 'AI' },
      { name: 'forceHttp', label: 'Force HTTP' },
    ],
  };

  return (
    <CodeSection>
      <foundation-header
        className="feature-flags-header-example"
        logo-src={logoUrl}
        featureFlagOptions={featureFlagOptions}
      ></foundation-header>
    </CodeSection>
  );
}
