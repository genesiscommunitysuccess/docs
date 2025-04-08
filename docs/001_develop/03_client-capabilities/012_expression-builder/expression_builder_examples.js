import { CodeSection } from '../../../../examples/ui/documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React from 'react';

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

export function RuleBuilderExample() {
	const isBrowser = useIsBrowser();
	const expressionBuilderRef = React.useRef(null);

	if (isBrowser) {
		const RapidImports = require('../../../../examples/ui/rapidImports');
		RapidImports.registerComponents();
	}

	const ruleConfig = {
		fields,
    partialRuleValidationWarning: true,
	}

	// Use useEffect to set the property imperatively after the component is mounted
	// but before the connected callback runs
	React.useEffect(() => {
		if (expressionBuilderRef.current) {
			// Set the property directly on the element
			expressionBuilderRef.current.ruleConfig = ruleConfig;
		}
	}, []);

	return (
		<CodeSection>
			<rapid-rule-expression-builder ref={expressionBuilderRef}></rapid-rule-expression-builder>
		</CodeSection>
	);
}
