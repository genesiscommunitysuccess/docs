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


### Pre-requisites
We are going to use the port 6060 from the localhost (localhost:6060/), because of that we need to garante that this port is availale. Please run the following command

```powershell
netstat -ano | findstr "6060"
```

This will show all processes using this port. In case nothing has been found, you can proceed to (start the local page)[#Start-the-local-page]

In case a process has shown, you will need to kill it by running the following command (you need to open your terminal in admin mode):

```powershell
taskkill /F /PID <INSERT_PID_NUMBER>
```

### Start the local page
For our user interface, the `genx` process has generated the following files:

- **home.template.ts**
- **home.ts**
- **home.styles.ts**
- 
Before we make any changes, let us run the front-end using the genesis plugin:

![](/img/start_UI.png)

After some minutes, you will be able to access the login page, but you won't be able to login to the page because we have not started our servers yet.

By clicking the "Start UI", the genesis plugin will install all dependencies required and will automatically start the local page at http://localhost:6060/login.

### Using genesis components
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
  
Now you have created a web application that knows how to connect to the server you have built. You are ready to [run the application](../../../getting-started/quick-start/run-the-application-docker/).