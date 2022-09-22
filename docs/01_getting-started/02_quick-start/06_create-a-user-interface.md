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

```shell title="./client"
npm run bootstrap
```

Once you have all dependencies installed, you can use the terminal to run your UI with the following command:

```shell title="./client"
npm run dev
```

We will make use of entity-management component, which includes CRUD functionality by providing previously defined endpoints.

Add code below to the template file.

```html {5-8} title="home.template.ts"
import {html} from '@microsoft/fast-element';
import type {Home} from './home';

export const HomeTemplate = html<Home>`
  <entity-management
    resourceName="ALL_TRADES"
    createEvent="EVENT_TRADE_INSERT"
  ></entity-management>
`;
```

You can now proceed to running the application and see the displayed data in the browser.  

The application should look something like this:

![](/img/trades-grid.png)

To add data to the grid, click the 'Add' button at the top right of the screen. 
