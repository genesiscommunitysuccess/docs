---
title: 'Quick Start - Create a user interface'
sidebar_label: 'Create a user interface'
id: create-a-user-interface
keywords: [getting started, quick start, ui, create a ui]
tags:
    - getting started
    - quick start
    - ui
    - create a ui
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

  
Now you have created a web application that knows how to connect to the server you have built. You are ready to run the application. You have an exciting choice:

- run using [Docker](../../../getting-started/quick-start/run-the-application-docker/) (very highly recommended - this is a very simple process)
- run using [WSL/Linux](../../../getting-started/quick-start/run-the-application/) (as you might have guessed, this is more complex)