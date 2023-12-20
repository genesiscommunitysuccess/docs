---
title: 'Foundation Forms - advanced customisation'
sidebar_label: 'Foundation Forms - advanced customisation'
id: forms-customisation
keywords: [filters, genesis, foundation, ui, forms, smart forms]
tags:
  - customisation
  - genesis
  - foundation
  - ui
  - forms
  - smart forms
---

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

:::tip
You can click to view our [API documentation](./docs/api/index.md) in a separate area.
:::

## Layout renderers

### Vertical and horizontal

`VerticalLayout` has a default layout, which is used if no `uiSchema` is specified. This arranges the control elements vertically.

```ts
const VerticalUISchema = {
  type: 'VerticalLayout',
  elements: [
    ...
  ],
};
```

If you specify a `uiSchema`, you can control the layout detail. This example arranges the control elements in two columns vertically.

```ts
const VerticalColumnsUISchema = {
  type: 'LayoutVertical2Columns',
  elements: [
    ...
  ],
};
```

The example below specifies a `uiSchema` that controls the elements horizontally.

```ts
const horizontalUISchema = {
  type: 'HorizontalLayout',
  elements: [
    ...
  ],
};
```

### Arrays (dynamic forms)
An array layout enables you to create a dynamic form with the ability to add, for example, multiple users.

For this, you need both a `uiSchema``jsonSchema` and a `jsonSchema`.

```ts
const arrayUISchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/users",
      options: {
        childUiSchema: {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/firstname",
              label: "First Name",
            },
            {
              type: "Control",
              scope: "#/properties/lastname",
              label: "Last Name",
            },
            {
              type: "Control",
              scope: "#/properties/email",
              label: "Email",
            },
          ],
        },
      },
    },
  ],
};
```

```ts
const arrayJsonSchema = {
  type: "object",
  properties: {
    users: {
      type: "array",
      items: {
        type: "object",
        title: "Users",
        properties: {
          firstname: {
            type: "string",
          },
          lastname: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
        },
      },
    },
  },
};
```

### Grouping information

The Categorization layout enables you to create more complex forms that are divided into appropriate categories (for example, personal information and address), which are displayed in separate tabs.

```ts
const categoryUISchema = {
  type: "Categorization",
  elements: [
    {
      type: "Control",
      scope: "#/properties/basic",
      label: "Personal information",
      options: {
        childElements: [
          {
            type: "HorizontalLayout",
            elements: [
              {
                type: "Control",
                scope: "#/properties/firstName",
              },
              {
                type: "Control",
                scope: "#/properties/secondName",
              },
            ],
          },
        ],
      },
    },
    {
      type: "Control",
      label: "Address",
      scope: "#/properties/address",
      options: {
        childElements: [
          {
            type: "HorizontalLayout",
            elements: [
              {
                type: "Control",
                scope: "#/properties/address/properties/street",
              },
              {
                type: "Control",
                scope: "#/properties/address/properties/streetNumber",
              },
            ],
          },
        ],
      },
    },
  ],
};
```

Group layout divides forms into groups. These are visible on the same tab, but they are separated from each other by their own labels (unlike Categorization, which displays groups in separate tabs).

```ts
const groupUISchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Group",
      label: "Person",
      scope: "#/properties/person",
      options: {
        childElements: [
          {
            type: "LayoutVertical2Columns",
            elements: [
              {
                type: "Control",
                label: "First Name",
                scope: "#/properties/person/properties/firstName",
              },
              {
                type: "Control",
                scope: "#/properties/person/properties/lastName",
              },
            ],
          },
        ],
      },
    },
    {
      type: "Group",
      label: "Address",
      scope: "#/properties/address/",
      options: {
        childElements: [
          {
            type: "VerticalLayout",
            elements: [
              {
                type: "Control",
                scope: "#/properties/person/properties/shippingAddress",
              },
              {
                type: "Control",
                scope: "#/properties/address/properties/street",
              },
            ],
          },
        ],
      },
    },
  ],
};
```

Stepper layout enables you to create complex forms that are divided into separate steps.

For this, you need both a  `uiSchema` and a `jsonSchema` so that validation and data saving can work properly.

:::info
Remember to add a `hide-submit-button` attribute to `foundation-forms`, because in this case, submit is built directly into stepper-layout.
:::

```ts
const uiSchemaStepper = {
  type: 'Stepper',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/person',
      label: 'Entity',
      options: {
        childElements: [
          {
            type: 'HorizontalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/person/properties/firstName',
              },
              {
                type: 'Control',
                scope: '#/properties/person/properties/secondName',
              },
            ],
          },
          {
            type: 'HorizontalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/person/properties/birthDate',
              },
              {
                type: 'Control',
                scope: '#/properties/person/properties/nationality',
              },
            ],
          },
        ],
      },
    },
    {
      type: 'Control',
      label: 'Doc',
      scope: '#/properties/address',
      options: {
        childElements: [
          {
            type: 'HorizontalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/address/properties/street',
              },
              {
                type: 'Control',
                scope: '#/properties/address/properties/streetNumber',
              },
            ],
          },
          {
            type: 'HorizontalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/address/properties/city',
              },
              {
                type: 'Control',
                scope: '#/properties/address/properties/postalCode',
              },
            ],
          },
        ],
      },
    },
    {
      type: 'Control',
      label: 'Primary doc',
      scope: '#/properties/vegetarianOptions',
      options: {
        childElements: [
          {
            type: 'VerticalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/vegetarianOptions/properties/favoriteVegetable',
              },
              {
                type: 'Control',
                scope: '#/properties/vegetarianOptions/properties/otherFavoriteVegetable',
              },
            ],
          },
        ],
      },
    },
  ],
};
```

```ts
const jsonSchemaStepper = {
  type: 'object',
  properties: {
    person: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          minLength: 3,
          description: 'Please enter your first name',
        },
        secondName: {
          type: 'string',
          minLength: 3,
          description: 'Please enter your second name',
        },
        birthDate: {
          type: 'string',
          format: 'date',
          description: 'Please enter your birth date.',
        },
        nationality: {
          type: 'string',
          description: 'Please enter your nationality.',
        },
      },
      required: ['firstName', 'secondName'],
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
        },
        streetNumber: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        postalCode: {
          type: 'string',
          maxLength: 5,
        },
      },
      required: ['postalCode'],
    },
    vegetarianOptions: {
      type: 'object',
      properties: {
        favoriteVegetable: {
          type: 'string',
          enum: ['Tomato', 'Potato', 'Salad', 'Aubergine', 'Cucumber', 'Other'],
        },
        otherFavoriteVegetable: {
          type: 'string',
        },
      },
      required: ['otherFavoriteVegetable'],
    },
  },
};
```

### Control renderers

Most renderers are defined directly in the `jsonSchema` that comes from the server, but you can also add these in your `uiSchema`.

String renderer is the default renderer, which creates a `text-field`.

```ts
const stringJsonSchema = {
  type: "object",
  properties: {
    ISSUER_NAME: {
      type: "string",
      minLength: 3,
      description: "kotlin.String",
    },
    USER: {
      type: "string",
      description: "kotlin.String",
    },
    MAIN_CONTACT: {
      type: "string",
      pattern: "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$",
      description: "kotlin.String",
    },
  },
};
```

The number renderer creates a `number-field`.

```ts
const numberJsonSchema = {
  type: "object",
  properties: {
    PRICE: {
      type: "number",
      description: "kotlin.Double",
    },
  },
};
```

The boolean renderer creates a `checkbox-field`.

```ts
const booleanJsonSchema = {
  type: "object",
  properties: {
    vegetarian: {
      type: "boolean",
    },
  },
};
```

The connected multiselect renderer creates a `multiselect` component with options from datasource.

```ts
const connectedMultiselectUISchema = {
  type: "HorizontalLayout",
  elements: [
    {
      type: 'Control',
      label: 'Rights',
      scope: '#/properties/RIGHT_CODES',
      options: {
        allOptionsResourceName: 'RIGHT',
        valueField: 'CODE',
        labelField: 'CODE',
      },
    },
    {
      type: 'Control',
      label: 'Users',
      scope: '#/properties/USER_NAMES',
      options: {
        allOptionsResourceName: 'USER',
        valueField: 'USER_NAME',
        labelField: 'USER_NAME',
      },
    },
  ],
};
```

Connected Select renderer is a select renderer that creates a `select` component with options.

```ts
const connectedSelectUISchema = {
  type: "HorizontalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/COUNTERPARTY_ID",
      options: {
        data: CounterpartyOptions,
        valueField: "value",
        labelField: "name",
      },
      label: "Counterparty",
    },
    {
      type: "Control",
      scope: "#/properties/INSTRUMENT_ID",
      options: {
        data: InstrumentOptions,
        valueField: "value",
        labelField: "name",
      },
      label: "Instrument",
    },
  ],
};
```

The date renderer creates a `date-field`.

```ts
const dateJsonSchema = {
  type: "object",
  properties: {
    tradeDate: {
      type: "string",
      description: "org.joda.time.DateTime",
    },
  },
};
```

### Specific renderers for filters

The filter date renderer creates two `date-fields` with minimum and maximum value.

```ts
const dateJsonSchema = {
  type: "object",
  properties: {
    tradeDate: {
      type: "string",
      description: "org.joda.time.DateTime",
    },
  },
};
```

The filter number renderer creates two `number-fields` with minimum and maximum value.

```ts
const numberJsonSchema = {
  type: "object",
  properties: {
    PRICE: {
      type: "number",
      description: "kotlin.Double",
    },
  },
};
```

## License

Note: this project provides front-end dependencies and uses licensed components listed in the next section; thus, licenses for those components are required during development. Contact [Genesis Global](https://genesis.global/contact-us/) for more details.

### Licensed components
Genesis low-code platform
