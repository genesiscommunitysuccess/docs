import { CodeLabel, CodeSection } from '../../documentationBase';
import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function DatePickerDemo({ inIndex = false }) {

  const isBrowser = useIsBrowser();

  if (isBrowser) {
    const RapidImports = require('../../rapidImports');
    RapidImports.registerComponents();
  }

  const datePickerRef = useRef(null);
  const [value, setValue] = useState('Not changed');
  const handleValueChanged = (value) => {
    console.log(value, 'date-picker-value');
    setValue(value);
  }

  useEffect(() => {
    if (datePickerRef.current) {
      datePickerRef.current.handleValueChanged = (e) => handleValueChanged(e.detail);
    }
  }, []);


    return (
      <CodeSection>
        <div style={{ color: 'var(--neutral-foreground-rest)'}}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <rapid-date-picker onValueChanged={(e) => handleValueChanged(e)}>
            </rapid-date-picker>
            <div>Date picker value: {value}</div>
          </div>
        </div>
      </CodeSection >
    )
}
