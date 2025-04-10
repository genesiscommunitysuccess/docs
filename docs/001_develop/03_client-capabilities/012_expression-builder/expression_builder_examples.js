import { CodeSection } from '../../../../examples/ui/documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useState } from 'react';

const EXAMPLE_MIN_AGE = 18;

export const fields = [
  {
    fieldId: 'firstName',
    label: 'First Name',
    type: 'string',
    input: 'text',
    defaultValue: 'Matt',
  },
  {
    fieldId: 'lastName',
    label: 'Last Name',
    type: 'string',
    input: 'text',
  },
  {
    fieldId: 'age',
    label: 'Age',
    type: 'int',
    input: 'number',
    validation: (age) =>
      parseInt(age) < EXAMPLE_MIN_AGE ? `User must be at least ${EXAMPLE_MIN_AGE}` : null,
  },
  {
    fieldId: 'weight',
    label: 'Weight',
    type: 'double',
    input: 'number',
  },
  {
    fieldId: 'isActive',
    label: 'Is Active',
    type: 'boolean',
    input: 'checkbox',
  },
  {
    fieldId: 'dateJoined',
    label: 'Date Joined',
    type: 'date',
    input: 'date',
  },
  {
    fieldId: 'country',
    label: 'Country',
    type: 'enum',
    input: 'select',
    values: {
      usa: 'United States',
      canada: 'Canada',
      uk: 'United Kingdom',
    },
  },
  {
    fieldId: 'lastUpdated',
    label: 'Last Updated',
    type: 'date-time',
    input: 'datetime-local',
  },
];

const model = {
  TYPE: "PREDICATE_EXPRESSION",
  OPERATION: "OR",
  EXPRESSIONS: [
    {
      TYPE: "BINARY_EXPRESSION",
      LEFT: {
        TYPE: "FIELD",
        NAME: "age",
      },
      OPERATION: "GREATER_THAN",
      RIGHT: {
        TYPE: "NUMBER",
        VALUE: "18",
      },
    },
    {
      TYPE: "PREDICATE_EXPRESSION",
      OPERATION: "AND",
      EXPRESSIONS: [
        {
          TYPE: "BINARY_EXPRESSION",
          LEFT: {
            TYPE: "FIELD",
            NAME: "country",
          },
          OPERATION: "EQUALS",
          RIGHT: {
            TYPE: "STRING",
            VALUE: "uk",
          },
        },
        {
          TYPE: "BINARY_EXPRESSION",
          LEFT: {
            TYPE: "FIELD",
            NAME: "isActive",
          },
          OPERATION: "EQUALS",
          RIGHT: {
            TYPE: "BOOLEAN",
            VALUE: true,
          },
        },
      ],
    },
  ],
};

export function RuleBuilderExample() {
  const isBrowser = useIsBrowser();
  const expressionBuilderRef = React.useRef(null);

  const [modelString, setModelString] = useState(model);
  const [showModel, setShowModel] = useState(true);

  if (isBrowser) {
    const RapidImports = require('../../../../examples/ui/rapidImports');
    RapidImports.registerComponents();
  }

  const change = (e) => {
    setModelString(e.nativeEvent.detail);
  };

  const ruleConfig = {
    fields,
    model,
    partialRuleValidationWarning: true,
  };

  // Use useEffect to set the property imperatively after the component is mounted
  // but before the connected callback runs
  React.useEffect(() => {
    if (expressionBuilderRef.current) {
      // Set the property directly on the element
      expressionBuilderRef.current.ruleConfig = ruleConfig;
    }
  }, []);

  return (
    <CodeSection style={{ flexDirection: 'column' }}>
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'flex-end' 
      }}>
        <rapid-button onClick={() => setShowModel(!showModel)}>
          {showModel ? 'Hide' : 'Show'} Model
        </rapid-button>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: showModel ? '2fr 1fr' : '1fr' 
      }}>
        <rapid-rule-expression-builder 
          ref={expressionBuilderRef} 
          onChange={change}
        ></rapid-rule-expression-builder>
        {showModel ? (
          <pre style={{ 
            backgroundColor: '#292d3e', 
            color: 'white', 
            borderRadius: '6px' 
          }}>
            <code>{JSON.stringify(modelString, null, 2)}</code>
          </pre>
        ) : null}
      </div>
    </CodeSection>
  );
}
