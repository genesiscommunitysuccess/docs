---
id: web-training-day4
title: Day 4
sidebar_label: Day 4
sidebar_position: 6
---

This day covers:

- [Design systems](#) and [Styling](#)
- [Reporting](#)
- [Angular integration​](#angular-integration)

## Design systems
[SHOW THIS CONTENT](https://internal-web/uat/secure/front-end/design-systems/introduction/)

A design system is a collection of resources for interactive media that promotes brand alignment of [UX assets](/front-end/design-systems/introduction/#ux-assets), [Design tokens](/front-end/design-systems/introduction/#design-tokens), [Component libary](/front-end/design-systems/introduction/#component-library), and [Documentation](/front-end/design-systems/introduction/#documentation-site).

Our design system implementation provides the elements listed above, as well as a few additional features. One of these is the ability for one design system to extend another. For example, a foundation/base design system can focus on functionality and provide components with minimal styling, while more specialised design systems can extend it and provide styling for a given target audience. Therefore, you are not restricted to a single design system within a project - it is possible to use multiple design systems within the same project (and even on the same page).


#### Exercise 4.1 Overriding some components using Design System
<!--
this is pretty much here:
-->
:::info ESTIMATED TIME
30 mins
:::

Let´s .....

## Styling
[SHOW THIS CONTENT](https://internal-web/uat/secure/getting-started/go-to-the-next-level/customize-look-and-feel/#styling-custom-component)
and
[SHOW THIS CONTENT](https://www.fast.design/docs/fast-element/leveraging-css/#styles-and-the-element-lifecycle)

#### Exercise 4.2 Styling an ag-grid
<!--
this is pretty much here:
-->
:::info ESTIMATED TIME
30 mins
:::

Let´s .....


## Reporting

The [Micro-front-end](/front-end/micro-front-ends/introduction/) architecture is a design approach in which a front-end app is decomposed into individual, semi-independent **micro applications** working loosely together. There are re-usable micro-front-ends that can be used by Genesis-powered applications, such as Front-end Reporting.

The Reporting component enables your users to create report specifications, run them, or save them for later use. From the GUI, users can:

- select columns from existing data sources
- save the report with a name and retrieve it for future use
- apply ad hoc filtering to a report
- export the report results to .csv  format

### Server configuration

To enable this component on the server, pull in the [reporting-distribution-5.6.1-bin.zip](https://genesisglobal.jfrog.io/ui/repos/tree/General/libs-release-local%2Fglobal%2Fgenesis%2Freporting-distribution%2F5.6.1%2Freporting-distribution-5.6.1-bin.zip) from Artifactory, and `unzip` it alongside genesis and auth modules in the standard genesis deployment server directory.

To make data available to users so that they can create reports, you must insert entries into the `REPORT_DATASOURCES` table. This table determines which data resources can be reported on. In most cases, you will have already set up queries in your [Data Server](/server-modules/data-server/basics/) to provide the data, but you can add new sources by creating new queries in your _application_**-dataserver.kts**.

The Report Server adds the following metadata services:

- ALL_SAVED_REPORTS (Data Server)
- SAVED_REPORTS (Request Response)
- ALL_REPORT_DATASOURCES (Request Response)

### Front-end configuration
 
To enable this micro front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-reporting` as a dependency in your *package.json* file.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-reporting": "1.0.1-alpha-7ea7de2.0"
  },
  ...
}
```

- Import the module and configure the route in your routes **config.ts** file.

**Synchronous example**

```javascript
// Import
import {Reporting} from '@genesislcap/foundation-reporting';

// Routes configure
public configure() {
  ...
  this.routes.map(
    ...
    {path: 'reporting', element: Reporting, title: 'Reporting', name: 'reporting'},
    ...
  );
}
```

**Asynchronous example**

```javascript
// Routes async configure
public async configure() {
  ...
  this.routes.map(
    ...
    {path: 'reporting', element: (await import('@genesislcap/foundation-reporting')).Reporting, title: 'Reporting', name: 'reporting'},
    ...
  );
}
```

#### Exercise 4.3 Using Micro-front-end Reporting
<!--
this is pretty much here:
-->
:::info ESTIMATED TIME
30 mins
:::

Let´s .....


## Angular integration

Genesis Foundation integrates nicely with Angular. Let's take a look at how you can set up an Angular project, starting from scratch.

### Setting up the Angular project

First, you'll need to make sure that you have [Node.js](https://nodejs.org/) installed. 

With Node.js installed, you can run the following command to install the Angular CLI:

```shell
npm install -g @angular/cli
```

With the CLI installed, you have access to the `ng` command-line interface. This can be used to create a new Angular project. For example, to create a new Angular App named "alpha-angular", you would use the following command:

```shell
ng new alpha-angular
```

Follow the prompts, answering each question in turn. At the end, you should have a basic runnable Angular application.

### Configuring packages

Next, we'll install the Genesis Foundation packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @genesislcap/alpha-design-system lodash-es
```

### Using the components

With all the basic pieces in place, let's run our app in dev mode with `ng serve --open`. The Angular CLI should build your project and make it available on localhost. Right now, it displays a basic welcome message, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/main.ts` file and add the following code:


import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!/examples/ui/alphaImports';

<CodeBlock className="language-ts">{Example}</CodeBlock>

This code uses the Genesis Foundation Design System to register `<alpha-card>`, `<alpha-button>` and `<alpha-text-field>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the HTML template in your `app/app.component.html` file with the following markup:

```html
<alpha-card>
  <h2>{{title}}</h2>
  <alpha-text-field [(ngModel)]='exampleTextField' name='exampleTextField' ngDefaultControl placeholder="Enter Some Text"></alpha-text-field>
  <alpha-button appearance="accent" (click)="onClick()">Click Me</alpha-button>
</alpha-card>
```

Replace the code in your `app/app.component.ts` file contents with this:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'alpha-angular';
  
  exampleTextField = '';

  onClick() {
    console.log(this.exampleTextField);
  }
}
```

To allow an NgModule to contain Non-Angular element names, add the following code in your `app/app.module.ts` file:

```ts 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({  
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
}) 
```

To add a splash of style, replace the `app/app.component.css` file contents with this:

```css
alpha-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

alpha-text-field {
  margin-bottom: 12px;
}

h2 {
  font-size: var(--type-ramp-plus-5-font-size);
  line-height: var(--type-ramp-plus-5-line-height);
}

alpha-card > alpha-button {
  align-self: flex-end;
}
```

:::note

Third-party controls require a ControlValueAccessor for writing a value and listening to changes on input elements. Add ngDefaultControl attribute to your component to have two-way binding working with FormControlDirective, FormControlName, or NgModel directives:

:::

```html
<alpha-text-field placeholder="name" id="name" formControlName="name" ngDefaultControl></alpha-text-field>
```

Congratulations! You're now set up to use Genesis Foundation and Angular!

#### Exercise 4.4 Adding a AgGrid to list Counterparties in our Angular solution
<!--
this is pretty much here: https://docs.genesis.global/secure/tutorials/training-resources/training-content-day3/#ui-configuring
-->
:::info ESTIMATED TIME
30 mins
:::

It is your time! Let's use AgGrid in [@genesislcap/foundation-zero](/tutorials/training-resources/training-content-day2/#genesislcapfoundation-zero) Genesis package presented before. The grid should list Counterparties in our Angular solution.

You can use the Data Server query `ALL_COUNTERPARTIES` to do that.


