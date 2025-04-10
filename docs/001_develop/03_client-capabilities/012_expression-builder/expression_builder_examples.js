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

export function RuleBuilderExample() {
	const isBrowser = useIsBrowser();
	const expressionBuilderRef = React.useRef(null);
	const isBrowser = useIsBrowser();
	const expressionBuilderRef = React.useRef(null);

	const [modelString, setModelString] = useState(model);
	const [showModel, setShowModel] = useState(true);
	const [modelString, setModelString] = useState({});
	const [showModel, setShowModel] = useState(true);

	if (isBrowser) {
		const RapidImports = require('../../../../examples/ui/rapidImports');
		RapidImports.registerComponents();
	}
	if (isBrowser) {
		const RapidImports = require('../../../../examples/ui/rapidImports');
		RapidImports.registerComponents();
	}

	const change = (e) => {
		setModelString(e.nativeEvent.detail);
	};
	const change = (e) => {
		setModelString(e.nativeEvent.detail)
	}

	const ruleConfig = {
		fields,
		model,
		partialRuleValidationWarning: true,
	};
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
		<CodeSection style={{flexDirection: 'column'}}>
			<div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}><rapid-button onClick={() => setShowModel(!showModel)}>{showModel ? 'Hide'  : 'Show'} Model</rapid-button></div>
			<div style={{display: 'grid', gridTemplateColumns: showModel ? '2fr 1fr' : '1fr'}}>
				<rapid-rule-expression-builder ref={expressionBuilderRef} onChange={change}></rapid-rule-expression-builder>
				{showModel ? <pre style={{backgroundColor: '#292d3e', color: 'white', borderRadius: '6px'}}><code>{JSON.stringify(modelString, null, 2)}</code></pre> : null }
			</div>
		</CodeSection>
	);
}

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
 * Generic expression builder component factory
 * @param {string} componentType - The type of expression builder component ('rule' or 'value')
 * @param {Object} initialModel - The initial model for the builder
 * @param {string} configPropName - The property name for configuration ('ruleConfig' or 'valueConfig')
 * @returns {Function} - A React component
 */
const createExpressionBuilder = (componentType, initialModel, configPropName) => {
	return function ExpressionBuilder() {
		const isBrowser = useIsBrowser();
		const expressionBuilderRef = React.useRef(null);

		const [modelString, setModelString] = useState(initialModel);
		const [showModel, setShowModel] = useState(true);

		if (isBrowser) {
			const RapidImports = require('../../../../examples/ui/rapidImports');
			RapidImports.registerComponents();
		}

		const change = (e) => {
			setModelString(e.nativeEvent.detail);
		};

		const config = {
			fields,
			model: initialModel,
			partialRuleValidationWarning: true,
		};

		// Use useEffect to set the property imperatively after the component is mounted
		// but before the connected callback runs
		React.useEffect(() => {
			if (expressionBuilderRef.current) {
				// Set the property directly on the element
				expressionBuilderRef.current[configPropName] = config;
			}
		}, []);

		// Create the component element dynamically
		const ExpressionBuilderElement = `rapid-${componentType}-expression-builder`;

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
					{React.createElement(ExpressionBuilderElement, {
						ref: expressionBuilderRef,
						onChange: change
					})}
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