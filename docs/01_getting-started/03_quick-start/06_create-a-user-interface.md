---
title: 'Create a user interface'
sidebar_label: 'Create a user interface'
id: create-a-user-interface
---

Now let's create a single page with a grid and a form for entering data.

For your user interface, the `genx` process has generated the following files:

- **home.template.ts**
- **home.ts**
- **home.styles.ts**

Before we make any changes, you need to install your npm dependencies by running the following in your terminal:

```shell
npm run bootstrap
```

Once you have all dependencies installed, you can use the terminal to run your UI with the following command:

```shell
npm run dev
```

We will make use of entity-management component which includes [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) functionality by providing previously defined endpoints.

Add code below to the template file.

```html title="home.template.ts"
<entity-management
  resourceName="ALL_TRADES"
  createEvent="EVENT_TRADE_INSERT"
></entity-management>
```

You can now refresh the application to display data from the server and make changes.
