import { useEffect } from 'react';
import { CodeSection } from "@site/examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './language_header_example.css';

export default function PrimitiveHeaderExample() {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    const RapidImports = require("@site/examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  const logoUrl = useBaseUrl('/img/logo-icon--light.svg');

  const languageOptions = { availableLanguages: ['en', 'es'], selectedLanguage: 'es' };

  return (
    <CodeSection>
      <foundation-header
        className="language-header-example"
        logo-src={logoUrl}
        show-language-selector
        languageOptions={languageOptions}
      ></foundation-header>
    </CodeSection>
  );
}
