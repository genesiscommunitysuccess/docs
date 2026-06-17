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

const ruleModel = {
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

const valueModel = {
  TYPE: "METHOD_EXPRESSION",
  PARAMETERS: [
    {
      TYPE: "FIELD",
      NAME: "lastUpdated"
    }
  ],
  METHOD: "LONG_TO_DATE_TIME"
};

/**
 * Interactive demo uses the native custom element (same pattern as other Docusaurus examples).
 * The React tab in the docs shows the RapidRuleExpressionBuilder / RapidValueExpressionBuilder wrapper.
 */
const createExpressionBuilder = (componentType, initialModel, configPropName) => {
  const tagName = `rapid-${componentType}-expression-builder`;
  const config = {
    fields,
    model: initialModel,
    partialRuleValidationWarning: true,
  };

  return function ExpressionBuilder() {
    const isBrowser = useIsBrowser();
    const [modelString, setModelString] = useState(initialModel);
    const [showModel, setShowModel] = useState(true);

    if (isBrowser) {
      const RapidImports = require('../../../../examples/ui/rapidImports');
      RapidImports.registerComponents();
    }

    const change = (e) => {
      const event = e.nativeEvent ?? e;
      setModelString(event.detail);
    };

    const setBuilderRef = React.useCallback((el) => {
      if (el) {
        el[configPropName] = config;
      }
    }, [configPropName]);

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
          {isBrowser
            ? React.createElement(tagName, {
                ref: setBuilderRef,
                onChange: change,
              })
            : null}
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
  };
};

// Create the specific builder components using the factory
export const RuleBuilderExample = createExpressionBuilder('rule', ruleModel, 'ruleConfig');
export const ValueBuilderExample = createExpressionBuilder('value', valueModel, 'valueConfig');

const dateModel = {
  TYPE: "PREDICATE_EXPRESSION",
  OPERATION: "AND",
  EXPRESSIONS: [
    {
      TYPE: "METHOD_EXPRESSION",
      METHOD: "DATE_TIME_IS_IN_RANGE",
      PARAMETERS: [
        {
          TYPE: "FIELD",
          NAME: "lastUpdated"
        },
        {
          TYPE: "STRING",
          VALUE: "DAY"
        },
        {
          TYPE: "STRING",
          VALUE: "PREVIOUS"
        }
      ]
    }
  ]
};

export const RuleBuilderDateExample = createExpressionBuilder('rule', dateModel, 'ruleConfig');
