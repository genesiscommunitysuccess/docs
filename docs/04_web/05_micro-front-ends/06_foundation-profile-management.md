---
title: 'Micro-front-ends - Profile Management'
sidebar_label: 'Profile Management'
Id: front-end-foundation-profile-management
keywords: [web, profile management, frontend, ui, micro-front-ends]
tags:
  - web
  - profile management
  - frontend
  - ui
  - micro-front-ends
---

# Profile Management

## API Reference

API reference [can be found here.](../foundation-entity-management_apiref/)

## Introduction

The Profile Management micro-front-end is used to manage the profiles on the front end. Two core components are used to manage the profiles - the grid and the form.

:::info
Profile Management is a concrete use case of the [Entity Management](./04_foundation-entity-management.md) micro front-end, which is provided as part of `foundation-ui`.
:::

Example grid view when managing profiles.
![Example profile management grid](/img/foundation-profile-management.png)

## Set-up

To enable this micro-front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-entity-management` as a dependency in your **package.json** file. Whenever you change the dependencies of your project, ensure you run the bootstrap command again. You can find more information in the [pacakge.json basics](../01_basics/04_package-json-basics.mdx) page.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-entity-management": "latest"
  },
  ...
}
```

- Import and declare the class in the page of the class where you wish to use the Profile Manager. Then add the profile management into the template html where required:
```javascript
// Import
import { Profiles } from '@genesislcap/foundation-entity-management';

// Declare class
Profiles;

// Example html with the profile management
export const AdminTemplate: ViewTemplate = html`
  <zero-tabs>
    <zero-tab-panel slot="tabpanel">
      <zero-error-boundary>
        <profile-management></profile-management>
      </zero-error-boundary>
    </zero-tab-panel>
  </zero-tabs>
`;
```

## Config

The functionality of the profile manager is customised through the properties you set in the html. This section covers the main properties that you will want to customise. For a full list of all of the properties, [see here](../foundation-entity-management_apiref/foundation-entity-management.profiles/#properties).

### Permissions

In contrast to Entity Management, we have a different way of displaying buttons and performing actions here. In this case, they are displayed if the user has the appropriate permissions from the server.

- `INSERT_PROFILE` - the user can add new profiles
- `DELETE_PROFILE` - the user can delete profiles
- `AMEND_PROFILE` - the user can update existing profiles

### Persist column state
`persist-column-state-key` is a string value which is used to control how the column states are persisted through actions such as page changes or refreshes. If no `persist-column-state-key` property is set, then the behaviour will be to _not_ persist the column state, and  the grid will revert back to its default state every time the user navigates away from it.

:::info
For more information on `persist-column-state-key` see [the section in the Entity Management](./04_foundation-entity-management.md#persist-column-state) page.
:::
