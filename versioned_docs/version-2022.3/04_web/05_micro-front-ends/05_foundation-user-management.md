---
title: 'Micro-front-ends - User Management'
sidebar_label: 'User Management'
Id: front-end-foundation-user-management
keywords: [web, user management, frontend, ui, micro-front-ends]
tags:
  - web
  - user management
  - frontend
  - ui
  - micro-front-ends
---


## API reference

API reference [can be found here](../foundation-entity-management_apiref/).

## Introduction

The User Management micro front-end is used to manage the users on the front end. Two core components are used to manage the entities:
- the grid
- the form

The grid contains an entity on each row and data in each column.

:::info
User Management is a concrete use case of the [Entity Management](./04_foundation-entity-management.md) micro front-end, which is provided as part of `foundation-ui`.
:::

Here is an example grid view for managing users:
![Example user management grid](/img/foundation-user-management.png)

## Set-up

To enable this micro-front-end in your application, follow the steps below:

- Add `@genesislcap/foundation-entity-management` as a dependency in your *package.json* file. Whenever you change the dependencies of your project, ensure you run the `$ npm run bootstrap` command again. You can find more information in the [package.json basics](/web/basics/package-json-basics/) page.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-entity-management": "latest"
  },
  ...
}
```

- Import and declare the class in the page of the class where you wish to use the user manager. Then add User Management to the template html where required:

```javascript
// Import
import { Users, } from '@genesislcap/foundation-entity-management';

// Declare class
Users;

// Example html with the user management
// You can customise this with additional fields, see futher in this documentation
export const AdminTemplate: ViewTemplate = html`
  <zero-tabs>
    <zero-tab-panel slot="tabpanel">
      <zero-error-boundary>
        <user-management></user-management>
      </zero-error-boundary>
    </zero-tab-panel>
  </zero-tabs>
`;
```

## Config

You can customise the functionality of User Management through the properties you set in the html. This section covers the main properties that you can customise. For a full list of all of the properties, [see here](../foundation-entity-management_apiref/foundation-entity-management.users/#properties).

### Columns

The primary way to configure the User Management functionality is via the columns that are displayed on the grid.
```javascript
// Default usage, will contain the "default" columns:
//    username, first name, last name, email, last login
// as well as the additional entity and status columns
<user-management></user-management>
```
The default columns are contained in the [UserColumnConfig](../foundation-entity-management_apiref/foundation-entity-management.userscolumnconfig) variable. The `Entity` and `Status` columns are always added to the grid.

To configure the columns yourself, set the `columns` attribute when you define the User Management in the html. You can mix in your custom column config with the default user columns config, using the javascript `spread` operator.
```javascript
// Custom usage, will contain the "default" columns:
//    username, first name, last name, email, last login
// the custom "userColumns"
// as well as the additional entity and status columns
<user-management :columns=${() => [...UsersColumnConfig, ...userColumns]}>
</user-management>
```
To see a more verbose version of this example, [see the second example here](../foundation-entity-management_apiref/foundation-entity-management.users/#example).

### Permissions

In contrast to Entity Management, we have a different way of displaying buttons and performing actions here. In this case, they are displayed if the user has the appropriate permissions from the server.

- `INSERT_USER` - the user can add new users
- `DELETE_USER` - the user can delete users
- `AMEND_USER` - the user can update existing users

### Persist column state
`persist-column-state-key` is a string value, which is used to control how the column states are persisted through actions such as page changes or refreshes. When using this micro front-end, it is set to `entity_profiles_management`.

:::info
For more info on `persist-column-state-key` see [the section in the entity management.](./04_foundation-entity-management.md#persist-column-state)
:::
