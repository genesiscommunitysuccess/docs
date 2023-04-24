---
title: 'Quick start - create a user interface'
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

## Using genesis components

For the user interface, the `genx` process has generated the following files:

- **home.template.ts**
- **home.ts**
- **home.styles.ts**

We will make use of the Entity Management component, which includes CRUD functionality by providing previously defined endpoints.

Add the code below to the **home.template.ts** in the path **client/web/src/routes/home/home.template.ts**.

```html title="home.template.ts"
import {html} from '@microsoft/fast-element';
import type {Home} from './home';

export const HomeTemplate = html<Home>`
  <entity-management
    resourceName="ALL_TRADES"
    createEvent="EVENT_TRADE_INSERT"
  ></entity-management>
`;
```
  
Now you have created a web application that knows how to connect to the server you have built.
