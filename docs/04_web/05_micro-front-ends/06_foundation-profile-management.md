---
title: 'Profile Management'
sidebar_label: 'Profile management'
Id: front-end-foundation-profile-management
tags:
  - profile
  - management
  - frontend
  - ui
  - mf
  - web
  - micro frontends
  - form
  - resource
---

# Profile Management

## API Reference

API reference [can be found here.](../foundation-entity-management_apiref/)

## Introduction

The Profile Management micro fronted used to manage the profiles on the front-end. Two core components are used to manage the profiles - the grid and the form. The grid contains an entity on each row and data in each column. Under the hood the grid uses [ag-grid](https://www.ag-grid.com/) and hence has a lot of its features such as filtering and ordering of data.

:::info
Profile Management is a concrete use case of the [entity management](./04_foundation-entity-management.md) micro-frontend which is provided as part of `foundation-ui`.
:::

Example grid view when managing profiles.
![Example profile management grid](/img/foundation-profile-management.png)

## Set-up

To enable this micro front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-entity-management` as a dependency in your *package.json* file. Whenever you change the dependencies of your project, ensure you run the bootstrap command again.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-entity-management": "latest"
  },
  ...
}
```

- Import and declare the class in the page of the class where you wish to use the profile manager. Then add the profile management into the template html where required:
```javascript
// Import
import { Profiles, } from '@genesislcap/foundation-entity-management';

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

The functionality of the profile manager is customised through the properties you set on it in the html. This section will cover the main properties that you will want to customise. For a full list of all of the properties [see here](../foundation-entity-management_apiref/foundation-entity-management.profiles/#properties).

### Permissions

`permissions` is an array of the authorisations that the user has for interacting with the entity manager. For example, to allow the user to be able edit existing entities then this array. Permissions are controlled with [enum values](../foundation-entity-management_apiref/foundation-entity-management.permissions_2/#enumeration-members).

:::info
By default the `permissions` are set automatically depending on the authorisations of the user - if the user is an `ADMIN` then they will have *all* permissions, else they will have *no* permissions.
:::

### Persist Column State
`persist-column-state-key` is a string value which is used to control how the column states are persisted through actions such as page changes or refreshes. If no `persist-column-state-key` property is set then the behaviour will be to _not_ persist the column state, and hence the grid will revert back to its default state every time the user navigates away from it.

:::info
For more info on `persist-column-state-key` see [the section in the entity management.](./04_foundation-entity-management.md#persist-column-state)
:::
