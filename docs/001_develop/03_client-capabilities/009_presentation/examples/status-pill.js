import { CodeSection } from "../../../../../examples/ui/documentationBase.js";
import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function StatusPillDemo({ inIndex = false }) {

  const isBrowser = useIsBrowser();

  if (isBrowser) {
    const RapidImports = require("../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  const fiveMinutesTimeInMiliseconds = Math.round(new Date().getTime() + 60000);

  return (
    <CodeSection>
      <div style={{ color: 'var(--neutral-foreground-rest)'}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <rapid-status-pill
            icon-name="check"
            text="Success"
            background-color="green"
          >
          </rapid-status-pill>
          <rapid-status-pill
            icon-name="xmark"
            text="Failure"
            background-color="red"
          >
          </rapid-status-pill>
          <rapid-status-pill
            icon-initial="S"
            text="Live"
            icon-initial-background-color="#0c52b9"
            background-color="#547cb6"
          >
          </rapid-status-pill>
          <rapid-status-pill
            icon-name="clock"
            text="Market expires in"
            background-color="#9c851b"
            date-countdown={fiveMinutesTimeInMiliseconds}
          >
          </rapid-status-pill>
        </div>
      </div>
    </CodeSection >
  )
}
