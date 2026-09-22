import { useEffect, useRef } from 'react';
import { CodeSection } from "@site/examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './feature_flags_header_example.css';

const featureFlagOptions = {
  availableFlags: [
    { name: 'ai', label: 'AI' },
    { name: 'forceHttp', label: 'Force HTTP' },
  ],
};

export default function FeatureFlagsHeaderExample() {
  const isBrowser = useIsBrowser();
  const headerRef = useRef(null);

  if (isBrowser) {
    const RapidImports = require("@site/examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  const logoUrl = useBaseUrl('/img/logo-icon--light.svg');

  // FAST @observable properties are not HTML attributes. Docusaurus SSR/hydration
  // would stringify a JSX object prop, so assign after the custom element upgrades.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const assignOptions = () => {
      el.featureFlagOptions = featureFlagOptions;
    };

    // Option rows live in the nested multiselect shadow tree (only mounted when
    // the panel opens). Without this, li[part=option] stays ~16px while the
    // checkbox is ~27px, so labels overlap.
    const injectOptionSpacing = () => {
      const multiselect = el.shadowRoot?.querySelector('.feature-flags-selector');
      const shadow = multiselect?.shadowRoot;
      if (!shadow || shadow.getElementById('docs-option-spacing-fix')) {
        return;
      }
      const style = document.createElement('style');
      style.id = 'docs-option-spacing-fix';
      style.textContent = `
        li[part="option"] {
          display: flex;
          align-items: center;
          min-height: 32px;
          height: auto;
          padding: 4px 8px;
          box-sizing: border-box;
        }
        .checkbox-container zero-checkbox,
        .checkbox-container rapid-checkbox,
        .checkbox-container foundation-checkbox {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 5px 0 5px 5px;
          box-sizing: border-box;
        }
      `;
      shadow.appendChild(style);
    };

    const observer = new MutationObserver(injectOptionSpacing);

    const start = () => {
      assignOptions();
      if (el.shadowRoot) {
        observer.observe(el.shadowRoot, { childList: true, subtree: true });
      }
      injectOptionSpacing();
    };

    if (customElements.get('foundation-header')) {
      start();
    } else {
      customElements.whenDefined('foundation-header').then(start);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <CodeSection>
      <foundation-header
        ref={headerRef}
        className="feature-flags-header-example"
        logo-src={logoUrl}
      ></foundation-header>
    </CodeSection>
  );
}
