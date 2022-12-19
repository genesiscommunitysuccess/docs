---
id: training-content-day2
title: Day two
sidebar_label: Day two
sidebar_position: 4
---

<details>
  <summary>Day one recap</summary>
  <div>
    <div>Here are the main takeaways from <a href="/getting-started/developer-training/training-content-day1/">Day one</a>.</div>
    <li>Genesis low-code platform is the only low-code platform for the financial markets.</li>
    <li>Genesis platform is based on event-driven and microservice architecture.</li>
    <li>Genesis platform resources are powered by GPAL, which plugs into IntelliJ.</li>
    <li>We created a project from scratch using <a href="/getting-started/developer-training/training-content-day1/#1-create-a-new-project">GenX CLI</a>.</li>
    <li>We defined our data model adding <a href="/getting-started/developer-training/training-content-day1/#add-fields">fields</a>, and a <a href="/getting-started/developer-training/training-content-day1/#add-a-table">table</a> called TRADE.</li>
    <li>We added business logic creating a Data Server <a href="/getting-started/developer-training/training-content-day1/#data-server">query</a> and an Event Handler method to <a href="/getting-started/developer-training/training-content-day1/#event-handler">insert data</a>.</li>
    <li> We prepared the server to <a href="/getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process">build and deploy</a>.</li>
  </div>
</details>

This day covers:

- [An introduction to UI](#introducing-the-ui)
- [Creating a user interface](#create-a-user-interface)
- [Extending the data model](#extending-our-initial-application)

## Introducing the UI

Genesis provides a modern future-proofed web stack on top of [Microsoft FAST](https://www.fast.design/docs/introduction/), which is a lightweight abstraction that enables you to easily ​build performant, memory-efficient, standards-compliant ​Web Components.

### Web Components

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are at the very heart of our strategy, based on native browsers and a standards-based ​component model. 

Web Components are custom html elements that completely encapsulate their logic to create self-contained reusable components that do not clash or interfere with the rest of application. They are future-proof and interoperable with traditional web frameworks such as Angular, React and Vue.

We currently offer over 40 [web components](web/web-components/form/button/) such as Button and Text Field, which are ready to go. That number is growing (and we can work with you if you need to create bespoke web components for specific needs). 

Frameworks like React, Angular, Vue and so on, have traditionally offered component models to developers. However, Web Components are literally the standard component model of the web, written into the HTML specification. Applications themselves can be fully encapsulated web components too; for example, YouTube is a web component, made up of many smaller web components.

### Micro front-ends

On a higher level, the Genesis low-code platform also offers a number of re-usable Micro front-ends for common functions, such as user management, entity management ([CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)), reporting and so on. 

This architecture is a design approach in which a front-end app is decomposed into individual, semi-independent micro applications working loosely together. The micro-front-end concept is vaguely inspired by, and named after, microservices. Independent development teams can collaborate on a front-end app more easily using this approach, and can each have their own release cadence. 

At Genesis, we use a number of technologies to enable this functionality, including [Webpack 5 Module Federation](https://webpack.js.org/concepts/module-federation/).

### Genesis packages​

Our components are distributed as npm packages, such as:

#### `@genesislcap/foundation-ui` 
When you generate a [design system](web/design-systems/introduction/) using the CLI, it will automatically extend a base design system that we have provided. ​This highly configurable design system is called Genesis Foundation UI. It is made up of a set of Web Components and accompanying design tokens. The visual design can be impacted in myriad ways using the tokens, CSS, element templates and shadow DOM options to provide everythin you need for your application.

#### `@genesislcap/foundation-zero` 
Our design system variant, called Zero Design System​. This provides the standard components, such as buttons and data grids (wrappers around Microsoft FAST components); these can be easily integrated with the back end using component attributes such as 'resourceName', which displays and updates data in real time from a Data Server resource.

#### `@genesislcap/foundation-utils​` 
Useful components like loggers, formatters, environment related components etc to be used in your templates.

#### `@genesislcap/foundation-comms` 
Core Foundation UI communication system with the server. This provides, among other things, connection components that you can use to connect to the server and do things like subscribing to data streams, commit events or request data.

There are many more packages, but that's what we need for now to develop our application.

### Web UI design
![](/img/WebUIDiagram.png)

Please look at the complete UI reference<!-- TODO: What is the proper link for this? --> for more details about the Web UI. In this training, we're going to use the Micro Front-ends, which are the easiest way to start working with the UI.

## Create a user interface

Now let's create a single page with a grid and a form for entering data.

Before you start, check if you have set a valid API_HOST in **client/web/package.json**.

The syntax for the API_HOST is:
- protocol (followed by a colon delimiter)
- secure websocketshost (followed by a colon delimiter)
- port (443 is the port assigned for secure HTTP traffic)
- /gwf/ (this is the standard path for Genesis platform)

for example: ws://localhost:443/gwf/



For your user interface, the `genx` process has generated the following files:

- **home.template.ts**
- **home.ts**
- **home.styles.ts**

We are going to update the files **home.template.ts** and **home.ts**, so the application will be able to display a single page and enable you to insert a new trade.
As we are using *Micro Front-ends*, there is no need to change the file **home.styles.ts**; the styles will be inherited from the base components.


### EntityManagement

We want to be able to insert a Trade grid with data into our project. For this, we will use the *Micro Front-end* called **EntityManagement**.

First, open the file **home.ts** to import the Micro front-ends needed, as well as declaring EntityManagement after the imports.

```ts {1,3,5}
import {customElement, FASTElement, observable} from '@microsoft/fast-element';
...
import {EntityManagement} from '@genesislcap/foundation-entity-management';

EntityManagement; //imported from '@genesislcap/foundation-entity-management' to display Trade grid

const name = 'home-route';
...
```

Now, still in the **home.ts** file, let's add two constants to define:

- the columns config (*defaultColumnConfig*)
- the fields available (*COLUMNS*). 

We need to declare the columns and permissions in the Home class as well. 

```ts {5-10,13-39,47-48,52}
...
const name = 'home-route';

//describes the default config for the grid columns
const defaultColumnConfig = {
  enableCellChangeFlash: true,
  enableRowGroup: true,
  enablePivot: true,
  enableValue: true,
};

//grid columns that will be showed
const COLUMNS = [
  {
    ...defaultColumnConfig,
    field: 'TRADE_ID',
    headerName: 'Id',
  },
  {
    ...defaultColumnConfig,
    field: 'QUANTITY',
    headerName: 'Quantity',
  },
  {
    ...defaultColumnConfig,
    field: 'PRICE',
    headerName: 'Price',
  },
  {
    ...defaultColumnConfig,
    field: 'SYMBOL',
    headerName: 'Symbol',
  },
  {
    ...defaultColumnConfig,
    field: 'DIRECTION',
    headerName: 'Direction',
  },
];

@customElement({
  name,
  template,
  styles,
})
export class Home extends FASTElement {
  @observable columns: any = COLUMNS;
  
  constructor() {
    super();
  }
}
```

We can now insert the grid into our page. Open the file **home.template.ts** and insert the *entity-management* tag using the class attributes we just created.

```ts {5-12}
import {html, } from '@microsoft/fast-element';
import type {Home} from './home';

export const HomeTemplate = html<Home>`
  <entity-management
      resourceName="ALL_TRADES"
      title = "Trades"
      entityLabel="Trades"
      createEvent = "EVENT_TRADE_INSERT"
      :columns=${x => x.columns}
  ></entity-management>
`;
```

At this point, the application is now able to display and insert data.

### Running the application locally 

Now you are ready to run the application you have created for the front end.

From the workspace **alpha/client** folder, run:
```
npm run bootstrap
```

Next, spin up the dev server:

```
npm run dev
```

The application will open at `http://localhost:6060/login`.
![](/img/btfe--positions-example--login.png)

:::warning Node.js 17 issue
After running, if you receive an error message similar to this `digital envelope routines::unsupported`, please double-check this Node.js 17 issue [reported](https://github.com/webpack/webpack/issues/14532).

The solution described in this issue's history [here](https://github.com/webpack/webpack/issues/14532#issuecomment-947012063) is pretty much exporting an environment variable NODE_OPTIONS setting the value below
```shell
export NODE_OPTIONS=--openssl-legacy-provider
```
:::

:::tip
If you try to run the application and there is already a process using the same port, check the process. If you are certain that it should not be running (for example, if it is the result of caching or old runs), you can run the command-line below as Administrator to search the process and kill it. 

```shell
netstat -ano | findstr :<yourPortNumber>
taskkill /PID <typeyourPIDhere> /F
```
:::

### CONGRATULATIONS
You have completed your first application with the Genesis Platform! 

:::note Great things come from great people!
Now take some time to enjoy it, play with your application for a few minutes.
:::

### Exercise 2.1: inspecting the messages between the UI and the server
:::info ESTIMATED TIME
30 mins
:::

The communication between the UI and the server happens through messages sent via a web socket connection, all managed by the Genesis Platform.

But did you know that you can inspect these messages using [Chrome DevTools](https://developer.chrome.com/docs/devtools/overview/)? That's very useful for debugging what's happening behind the scenes and capturing the data transferred for troubleshooting.

Now, using the [Network tab](https://developer.chrome.com/docs/devtools/network/), try to insert a trade and see if you can find the data being sent to the server:

1. Log out of the application.
2. Press `F12` to open the Dev Tools, click on the `Network` tab and select `WS` (keep it open during this exercise).
3. Navigate to your app http://localhost:6060 and in the Dev Tools, click on the resource `gwf/` (in the Network -> WS tab).
4. Log in and try to insert a new trade.
5. Try to find the message containing the new trade data.


## Extending our initial application

We want to build a real-time positions application, where trades can be entered, and will be aggregated to maintain positions.

![](/img/day2-training-extended-datamodel.png)

### Exercise 2.2: extending the application
:::info ESTIMATED TIME
60 mins
:::

Let's extend the data model and create a CRUD. You will:

- add the tables **Counterparty** and **Instrument** as per the definition below. 
- add the fields *COUNTERPARTY_ID* and *INSTRUMENT_ID* to the **Trade** table.

Use all the previous knowledge you've got.

![](/img/day2_new-tables-alpha.png)

As a reminder, these are the steps needed to complete this task:

1. Remove all TRADE records using the [DropTable](/operations/commands/server-commands/#droptable) server command. To do that, remember the explanation on how to [run server commands](/getting-started/developer-training/training-content-day1/#running-server-commands).
2. Edit **alpha-fields-dictionary.kts** first, and don't forget to run the [generateFields](/getting-started/developer-training/training-content-day1/#generatefields) gradle task when you finish this. Remember that fields are defined separately from tables, so that they (including their meta-data) can be re-used across multiple tables and show linkage.​
3.  Then edit **alpha-tables-dictionary.kts** to add the new tables and the fields you created in the previous step. Don't forget to add COUNTERPARTY_ID and INSTRUMENT_ID in the TRADE table. When you finish, remember to run [genesis-generated-dao](/getting-started/developer-training/training-content-day1/#generatedao).
4. Add queries to the Data Server. These must point to the new tables in the **alpha-dataserver.kts** file.
5. Create INSERT, MODIFY and DELETE (CRUD) events for all entities, using Event Handlers. When you finish, remember to [build and deploy](/getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process).​

:::tip adding a new `eventHandler` block
Example on how to add additional blocks in the `eventHandler`:
```kotlin
eventHandler {
    eventHandler<Trade>(name = "TRADE_INSERT") {
        onCommit { event ->
            entityDb.insert(event.details)
            ack()
        }
    }

    eventHandler<Trade>(name = "TRADE_MODIFY") {
        onCommit { event ->
            entityDb.modify(event.details)
            ack()
        }
    }

    eventHandler<Trade>(name = "TRADE_DELETE") {
      onCommit { event ->
          entityDb.delete(event.details)
          ack()
      }
    }
}
```
:::

- [Build and deploy](/getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process). You can test by using Postman or Console (see more details in the next section) to insert:
  - a new counterparty
  - a new instrument
  - a new trade



### API testing with auto-generated REST endpoints

As an alternative to Genesis Console, take this opportunity to test your work with an HTTP client such as Postman or Insomnia.
- [Postman web version](https://go.postman.co/home/)
- [Postman App](https://www.postman.com/downloads/)
- [Insomnia App](https://insomnia.rest/download)

:::tip REST endpoints
When we test our resources using an HTTP client as described here, we're taking advantage of the [REST endpoints](/server/integration/rest-endpoints/introduction/) provided by the platform. Without any additional code from you, it automatically exposes all configured resources, such as Data Server queries and Event Handlers, as HTTP endpoints via the GENESIS_ROUTER service. This also enables you to do some API testing automation for all your back-end components.

:::

##### Logging in 
Whichever client you are using, you need to log in before you can send test requests to the server. This involves two things:
- providing a SOURCE_REF - this can be any string that identifies all your activity while you are logged in
- retrieving a SESSION_AUTH_TOKEN, which you can copy and use to authorise all your test requests

For example, to log in using Postman:
1. Create a new query in Postman.
2. In front of the URL, set the call to **POST**.
3. For the URL, you need to supply your server instance, then **:9064** (which sends you to the application's Router), and then **event-login-auth**. For example:
**http://localhost:9064/event-login-auth**. 
Alternatively, you can use the reverse proxy already set up on the WSL instance and go with this URL: **http://localhost/gwf/event-login-auth**
4. Set the Body to JSON and insert the message below (substituting your correct user name and password) in the main body. 

```
{
    "MESSAGE_TYPE": "EVENT_LOGIN_AUTH",
    "SERVICE_NAME": "AUTH_MANAGER",
    "DETAILS": {
        "USER_NAME": "JaneDee",
        "PASSWORD": "beONneON*74"
    }
}
```
5. Click to view the header, then insert SOURCE_REF in the header. For this field, you can use any string that identifies you (in effect). In the example below, we have set SOURCE_REF to *BAUDOIN1* (for no particular reason).
&nbsp
&nbsp
![](/img/test-login-result-alpha.png)

6. When you have done this, click on the **Send** button.

This returns a set of details on the bottom side of the Postman window, where you can copy the SESSION_AUTH_TOKEN, which you will need for your test requests.

Once you have the SESSION_AUTH_TOKEN, keep a copy that you can paste into each request as you make your test call.

In the example below, we are using Postman as the client API. We are going to test the EVENT_COUNTERPARTY_INSERT Event Handler by adding a new counterparty.

###### url and Body
In front of the url, set the call to **POST**.

The url consists of:

- the address or hostname of the server
- if necessary, some extra routing; in this case **gwf** uses a proxy to access the server
- the name of the event handler

```
http://localhost/gwf/EVENT_COUNTERPARTY_INSERT
```


Set the body to **JSON**. In the body, you need to insert the details of the fields for the new counterparty, as shown below:

```
{
    "DETAILS": {
      "SOURCE_REF": "BAUDOIN1",
      "COUNTERPARTY_LEI": "Thomas S Eiselberg",
      "COUNTERPARTY_ID": "EISELBERG",
      "ENABLED": 1,
      "COUNTERPARTY_NAME": "Thomas S Eiselberg GmbH"
    }
}
```

![](/img/test-eh-url-body-alpha.png)

###### Header
In the header, you need to supply:

- a SOURCE_REF (always), which identifies you; you can use any string value that suits you
- the SESSION_AUTH_TOKEN that permissions you to access the server

When you have all these elements in place, click on **Send** to make the call. If the event is a success, you will receive an **ACK** message.

![](/img/test-eh-header-alpha.png)

###### Checking the insertion
Now you can check that the new counterparty you inserted is in the correct table of the database. The resource you need to check is the Request Server called ALL_COUNTERPARTIES.

In front of the url, set the call to **POST**.

The url consists of:

- the address or hostname of the server
- if necessary, some extra routing; in this case **gwf** uses a proxy to access the server
- the name of the request server

Set the body to **JSON**. There is no need for any information in the body. Simply insert a pair of curly brackets **{}**. 

![](/img/test-eh-check-insertion-alpha.png)

In the header, you need to supply:

- a SOURCE_REF (always), which identifies you; you can use any string value that suits you
- the SESSION_AUTH_TOKEN that permissions you to access the server

When you have this in place, click on **Send** to make the call. You can see that the fields for the instruments have been returned on the right of the screen.

![](/img/test-eh-insert-success-alpha.png)

### Exercise 2.3: testing with Postman
:::info ESTIMATED TIME
30 mins
:::

Create requests on POSTMAN for all the events created so far.
