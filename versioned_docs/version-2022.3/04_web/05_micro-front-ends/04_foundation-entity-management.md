---
title: 'Micro front-ends - Entity Management'
sidebar_label: 'Entity Management'
Id: front-end-foundation-entity-management
keywords: [web, entity management, frontend, ui, micro-front-ends]
tags:
  - web
  - entity management
  - frontend
  - ui
  - micro-front-ends
---
# Entity Management

## API Reference

Our API reference documentation is in a separate area, which [can be found here](../foundation-entity-management_apiref/).

## Introduction

The Entity Management micro front-end is used to connect to a resource on the back end and manage it from the front end. Handlers can be set up for create, update, and delete events; after adding an event, a button is displayed so that the user can perform the action. There is a list of pre-defined events and resources to manage, but you can manage custom resources that you create on the back end too.

:::tip
The buttons are accessed conditionally, based on the specified events. For example, if the current user is only able to edit the entities, then you should only set the edit event on the entity-manager - you need to set the events to be conditional on user authorisation.
:::

Two core components are used to manage the entities - the grid and the form. The grid contains an entity on each row and data in each column.

Here is an example grid used to manage counterparties:

![Example entity management grid](/img/foundation-entity-management-grid.png)

The other component is the form, and this is used to update an existing entity or create a new one. An example form is shown here:

![Example entity management form](/img/foundation-entity-management-form.png)

## Set-up

To enable this micro front-end in your application, follow the steps below.

1. Add `@genesislcap/foundation-entity-management` as a dependency in your **package.json** file. Whenever you change the dependencies of your project, ensure you run the `$ npm run bootstrap` command again. For more information, see the [package.json basics](../../../web/basics/package-json-basics/) page.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-entity-management": "latest"
  },
  ...
}
```

2. Import and declare the class in the page of the class where you wish to use the Entity Manager. Then add the entity management into the template HTML where required:

```javascript
// Import
import { EntityManagement, } from '@genesislcap/foundation-entity-management';

// Declare class
EntityManagement;

// Example html with the entity management used in two different tabs to manage two
// different resources - one managing the counterpartys, and one managing the users.
export const AdminTemplate: ViewTemplate = html`
  <zero-tabs>
    <zero-tab-panel slot="tabpanel">
      <zero-error-boundary>
        <entity-management
          resourceName="ALL_COUNTERPARTYS"
          title="Counterparty Management"
          updateEvent="EVENT_COUNTERPARTY_MODIFY"
          deleteEvent="EVENT_COUNTERPARTY_DELETE"
          createEvent="EVENT_COUNTERPARTY_INSERT"
        ></entity-management>
      </zero-error-boundary>
    </zero-tab-panel>
    <zero-tab-panel slot="tabpanel">
      <zero-error-boundary>
        <entity-management
          resourceName="ALL_USERS"
          title="User Management"
          updateEvent="EVENT_AMEND_USER"
          deleteEvent="EVENT_DELETE_USER"
          createEvent="EVENT_INSERT_USER"
        ></entity-management>
      </zero-error-boundary>
    </zero-tab-panel>
  </zero-tabs>
`;
```

## Config

The functionality of the Entity Manager is customised through the properties you set on it in the HTML. This section covers the main properties that you need to customise. For a full list of properties, [see here](../foundation-entity-management_apiref/foundation-entity-management.entitymanagement/#properties).

### Title

`title` customises the title of the entity list so that the user can see what resource they are managing.

### Resource

`resourceName` refers to the name of either a `DATASERVER` query, a `ReqRep` definition or a specific `EVENT_HANDLER`. This essentially is the resource to be managed. In the [above example](#set-up), we use `ALL_COUNTERPARTYS`, which is a `DATASERVER` query (by convention, all Data Server queries start with `ALL_`).

### Events

`createEvent`, `updateEvent`, `deleteEvent` are set to be the events on the back end that handle the specific actions, such as deleting counterparty data. For the create and update functionality, these also define the resource in which the form is populated when the user is creating or updating an entity. After adding an event, a button for performing the selected action is displayed.

### Datasource configuration

Set this object to configure how the Entity Manager interacts with the resource. [See here](../foundation-entity-management_apiref/foundation-entity-management.datasourceconfiguration/#example).

### Persist column state
`persist-column-state-key` is a string value. It is used to control how the column states are persisted through actions such as page changes or refreshes. If no `persist-column-state-key` property is set, then the behaviour will be to _not_ persist the column state, and the grid will revert back to its default state every time the user navigates away from it.

:::warning
The string defines the key in which the serialised state of the columns is stored in an object in [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Therefore, if you are setting multiple Entity Managers in your application to persist the state, you need to use unique keys - otherwise, you will get undefined behaviour.
:::
