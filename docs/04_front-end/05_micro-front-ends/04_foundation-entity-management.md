---
title: 'Entity Management'
sidebar_label: 'Entity management'
Id: front-end-foundation-entity-management
tags:
  - entity
  - management
  - frontend
  - ui
  - mf
  - web
  - micro frontends
  - form
  - resource
---
# Entity Management

## API Reference

API reference [can be found here.](../foundation-entity-management_apiref/)

## Introduction

The Entity Management micro-front-end is used to connect to a resource on the back-end and manage it from the front-end. Handlers can be set up for create, update, and delete events - after adding an event, a button appears to perform the action. There are a list of pre-defined events and resources to manage, but you can manage custom resources that you create on the back-end too.

:::tip
The buttons are conditionally accessed based on the specified events. For example, if the current user should only be able to edit the entities then you should only set the edit event on the entity-manager - you need to conditionally set the events based on user authorisations.
:::

Two core components are used to manage the entities - the grid and the form. The grid contains an entity on each row and data in each column. Under the hood the grid uses [ag-grid](https://www.ag-grid.com/) and hence has a lot of its features such as filtering and ordering of data.

Example grid used to manage counterpartys.
![Example entity management grid](/img/foundation-entity-management-grid.png)

The other component is the form, and this is used to update an existing entity or create a new one. An example form is shown here.
![Example entity management form](/img/foundation-entity-management-form.png)

## Set-up

To enable this micro-front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-entity-management` as a dependency in your *package.json* file. Whenever you change the dependencies of your project, ensure you run the `$ npm run bootstrap` command again. For more info see the [pacakge.json basics](../01_basics/04_package-json-basics.md).

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-entity-management": "latest"
  },
  ...
}
```

- Import and declare the class in the page of the class where you wish to use the entity manager. Then add the entity management into the template html where required:
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

The functionality of the entity manager is customised through the properties you set on it in the HTML. This section will cover the main properties that you will want to customise. For a full list of all of the properties [see here](../foundation-entity-management_apiref/foundation-entity-management.entitymanagement/#properties).

### Title

`title` customises the title of the entity list so the user can see what resource they are managing.

### Resource

`resourceName` refers to the name of either a `DATASERVER` query, a `ReqRep` definition or a specific `EVENT_HANDLER`. This essentially is the resource to be managed. In the [above example](#set-up), we use `ALL_COUNTERPARTYS` which is a `SDATASERVER` query, as by convention they all start with `ALL_`.

### Events

`createEvent`, `updateEvent`, `deleteEvent` are set to be the events on the back-end that handle the specific actions, such as deleting counterparty data. For the create and update functionality, these also define the resource in which the form is populated when the user is creating or updating an entity. After adding an event, a button for performing the selected action appears.

### Datasource Configuration

Set this object to configure how the entity manager interacts with the resource. [See here](../foundation-entity-management_apiref/foundation-entity-management.datasourceconfiguration/#example).

### Persist Column State
`persist-column-state-key` is a string value, which is used to control how the column states are persisted through actions such as page changes or refreshes. If no `persist-column-state-key` property is set then the behaviour will be to _not_ persist the column state, and hence the grid will revert back to its default state every time the user navigates away from it.

:::warning
The string defines the key in which the serialised state of the columns is stored in an object in [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). Therefore, if you are setting multiple entity managers in your application to persist the state you need to use unique keys or you will get undefined behaviour.
:::
