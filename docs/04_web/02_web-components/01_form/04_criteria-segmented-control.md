---
title: 'Web Components - Criteria Segmented Control'
sidebar_label: 'Criteria Segmented Control'
id: criteria-segmented-control
keywords: [web, web components, criteria, segmented control]
tags:
    - web
    - web components
    - criteria
    - segmented control
---

This version allows you to use a segmented control that generates criteria based on the selected item.

1. Add `@genesislcap/foundation-criteria` as a dependency in your **package.json** file. Whenever you change the dependencies of your project, ensure you run the `$ npm run bootstrap` command again. For more information, see the [package.json basics](../../../../web/basics/package-json-basics/) page.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-criteria": "latest"
  },
  ...
}
```

2. Import and declare the class in the page of the class where you wish to use the Criteria Segmented Control. Then add the criteria segmented control into the template HTML where required:

```javascript
// Import
import { CriteriaSegmentedControl } from '@genesislcap/foundation-criteria';

// Declare class
CriteriaSegmentedControl;

const toolbarOptions: CriteriaSegmentedControlOption[] = [
  { label: 'A', field: 'INSTRUMENT_ID', value: 'id1', serialiser: Serialisers.EQ },
  { label: 'B', field: 'INSTRUMENT_ID', value: 'id2', serialiser: Serialisers.EQ },
  { label: 'C', field: 'INSTRUMENT_ID', value: 'id3', serialiser: Serialisers.EQ },
];

// Example of using the component:
export const ExampleTemplate: ViewTemplate = html`
  <criteria-segmented-control
   :criteriaOptions=${() => toolbarOptions}
   :value=${sync((x) => x.criteriaFilter)}
  >
   <label slot="label">Filter by instrument name</label>
  </criteria-segmented-control>
`;
```
## Use cases

* Used anywhere someone may want to visually and structurally group related interactive criteria.
