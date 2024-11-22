import { CodeSection } from '../../documentationBase';
import React, { useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

const oneDay = 24*60*60*1000;

const createDateFormat = (relativeTime = 0) => new Date(Date.now() + relativeTime).toISOString().slice(0,16)

export default function FiltersDemo({ children, color }) {
  const isBrowser = useIsBrowser();

  let FiltersModule = null;

  if (isBrowser) {
    const RapidImports = require('../../rapidImports');
    RapidImports.registerComponents();
    FiltersModule = require('@genesislcap/foundation-filters');
  }

  const [outputValue, setOutputValue] = useState('');
  const [startVal, setStartVal] = useState(createDateFormat(-1 * oneDay));
  const [endVal, setEndVal] = useState(createDateFormat(oneDay));

  const checkTimeWindow = () =>
    setOutputValue(FiltersModule.timeWindowFilter(startVal, endVal)
      ? "Current Date/Time exists within the start and end period"
      : "Current Date/Time doesn't fall between start and end period")

  const handleTextFieldChanged = (callback) => (event) => callback(event.target.value);

  return (
    <CodeSection>
      <div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
          <rapid-text-field
            type="datetime-local"
            value={startVal}
            onInput={handleTextFieldChanged(setStartVal)}>
            Start Period
          </rapid-text-field>
          <rapid-text-field
            type="datetime-local"
            value={endVal}
            onInput={handleTextFieldChanged(setEndVal)}>
            End Period
          </rapid-text-field>
          <rapid-button onClick={checkTimeWindow}>Check</rapid-button>
          <span style={{ height: '20px' }}>{outputValue}</span>
        </div>
      </div>
    </CodeSection>
  )
}
