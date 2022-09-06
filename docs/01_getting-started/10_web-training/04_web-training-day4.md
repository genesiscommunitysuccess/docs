---
id: web-training-day4
title: Day 4
sidebar_label: Day four
sidebar_position: 6
---

# Day 4 agenda
[Styling](#styling), [Design systems](#design-systems), [Micro Front-ends](#micro-front-ends) and [Angular integration​](#angular-integration).

## Styling

You might want to customise look and feel using layout and styles. For instance, we can style an [ag-grid](#ag-grid) or even a [layout](#layout) that supports responsive web design.

### Ag-Grid

We've seen how to create custom ag grids, now let's see another way to further style it.

Styling an ag-grid can be started by creating a stylesheet document that will have some style definitions for the grid. Create a stylesheet file called **orders.styles.ts** and provide the following code:

```ts title='orders.styles.ts'
import {css, ElementStyles} from '@microsoft/fast-element';

export const ordersGridStyles: ElementStyles = css`
    .notes-column {
        color: blue;
    }
`
```

Configure your column to have the specific class name [column config](https://ag-grid.com/javascript-data-grid/cell-styles/#cell-class):

```ts
{field: 'NOTES', cellClass: 'notes-column'},
```

In **order.template.ts**, in the grid tag, include utility that will inject your stylesheet to the component:

```ts {1,5}
import {ordersGridStyles} from "./orders-grid.styles";

<zero-ag-grid>
    ...    
    <slotted-styles :styles=${() => ordersGridStyles}></slotted-styles>
    ...
</zero-ag-grid>
`
```

If you need to provide different class names for specific conditions, you can provide a function to the `cellClass` column config, as shown in the example below:

```ts
{field: 'SIDE', cellClass: (params) => params.value === 'BUY' ? : 'buy-side', 'sell-side'},
```

Remember to add the new styles to your stylesheet file.

```ts
import {css, ElementStyles} from '@microsoft/fast-element';

export const tradesGridStyles: ElementStyles = css`
.notes-column {         
  color: blue;     
}

.buy-side {
  color: green;
}    

.sell-side {
  color: red;
}
`
```

### Layout

By default, all elements on screen will use `display:block`, but we can easily customise it using our custom component that supports responsive web design.

```html
<foundation-flex-layout class="flex-row flex-sm-column spacing-2x">
    <!--content-->
</foundation-flex-layout>
```

For further styling your components, it would make sense to start working with [Design Systems](#design-systems), which is our next topic.


### Exercise 4.1 Styling an ag-grid
:::info ESTIMATED TIME
20 mins
:::
Style the `quantity` field of the orders grid in such a way that if the value is bigger than 100 it will be in green, otherwise red.


## Design systems

A design system is a collection of resources for interactive media that promotes brand alignment of [UX assets](/front-end/design-systems/introduction/#ux-assets), [Design tokens](/front-end/design-systems/introduction/#design-tokens), [Component libary](/front-end/design-systems/introduction/#component-library), and [Documentation](/front-end/design-systems/introduction/#documentation-site).

The Genesis [design system](/front-end/design-systems/introduction/) implementation provides the elements listed above, as well as a few additional features, such as:
- set of reusable UI components
- configuration files which allow you to control colours, typography, sizing and various other aspects
- building blocks for creating your own custom components on top of the design system

When you generate a design system using the Genesis scaffolding CLI tool [GenX](/getting-started/quick-start/create-a-new-project/) it will automatically extend a base design system that we have provided. This highly configurable design system is called Genesis Foundation UI. Our design system starts in [Axure](https://www.axure.com/) and has been lab-tested to meet the needs of financial markets.

Design system are highly configurable and can be shared across multiple applications. When performing customisations, you can control the scope as follows:

* [Customisation (general)](#customisation-general) - applied to the design system itself, affecting all applications that use the system. 
* [Customisation (app-specific)](#customisation-app-specific) - this is only applied to a single application. Other applications using the same system are not affected.

### Customisation (general)

The starting point for making [general customisations](/front-end/design-systems/customisation-general/) is the `src/_config` folder:

```bash
alpha-design-system
├── dist
├── node_modules
├── src
│   ├── _config
│   │   ├── styles
│   │   │   ├── colors.ts
│   │   │   └── index.ts
│   │   ├── tokens
│   │   │   ├── custom.ts
│   │   │   ├── default.ts
│   │   │   └── index.ts
│   │   ├── values
│   │   │   ├── color.ts
│   │   │   ├── index.ts
│   │   │   ├── misc.ts
│   │   │   ├── sizing.ts
│   │   │   └── typography.ts
│   │   └── index.ts
```

It contains configuration files that set default values for various design tokens, as well as a few other settings. You can achieve major visual changes simply by modifying token defaults. There are several categories of token available:

* [Colour](/front-end/design-systems/tokens/colour/): base colours, dark/light mode, colour variants for interactive states (hover etc.)
* [Typography](/front-end/design-systems/tokens/typography/): default font family, font size and line height hierarchy
* [Sizing](/front-end/design-systems/tokens/sizing/): component sizing, spacing and border style
* [Miscellaneous](/front-end/design-systems/tokens/miscellaneous/): other configuration options, such as the naming prefix (e.g. `alpha`)

:::tip
To help you visualise how modifying tokens impacts the component look and feel, we offer a [live configuration preview](/front-end/design-systems/preview/).
:::

To go beyond adjusting token values, you can override the default component implementation. You can choose only to  override certain aspects of a component (such as template, styles or [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) options) or provide a completely custom implementation. By default, components in your design simply re-export components from the underlying foundation design system as is (exact code can vary):

```ts
import {foundationButton} from '@genesislcap/foundation-ui';

export const alphaButton = () => foundationButton();
```

Instead of re-exporting the default, you can provide your own custom implementation:

```ts
import {css, FoundationElement, FoundationElementDefinition, html} from '@genesislcap/foundation-ui';

export const styles = css`
/* CSS  */
`;

export const template = html<AlphaButton>`
/* Template */
`;

interface ButtonDefinition extends FoundationElementDefinition {
  /* Any properties */
}

export class Button extends FoundationElement {
  /* Any custom logic */
}

export const alphaButton = Button.compose<ButtonDefinition>({
  baseName: 'button',
  template,
  styles
});
```

### Customisation (app-specific)

In the [Customisation (app-specific)](/front-end/design-systems/customisation-app-specific/) you can also choose to customise either [all the components](#customising-all-components) or only [individual ones](#customising-individual-components).

#### Customising all components

When you register a design system in an application, there are several configuration options that affect all the components provided by that design system.

You can override the default prefix set in the `_config` folder for a specific application as follows:

```ts
import { alphaButton, provideDesignSystem } from '@genesislcap/alpha-design-system';

provideDesignSystem()
    .withPrefix('custom')
    .register(alphaButton())
```

The element can then be used in HTML using the `custom` prefix:

```html
<custom-button>Button</custom-button>
```

You can also override the default [shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) (typically `open`, as that is both recommended and the default). You can choose to close all shadow roots by default using `withShadowRootMode()`:

```ts
provideDesignSystem()
    .withShadowRootMode('closed')
    .register(/* ... */)
```

As a best practice, one should try to avoid registering the same component more than once. If your architecture makes this difficult or impossible, you can provide a custom callback to handle disambiguating the duplicate elements. Further details can be found [here](/front-end/design-systems/customisation-app-specific/#name-disambiguation).

#### Customising individual components

The APIs described above impact all components, but those options can also be configured or overridden on a per-component basis. Configuring the component itself takes priority over any design system configuration.

The prefix for a component can be configured for a component registration by providing a configuration object with a prefix field during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({ prefix: 'custom' })
    );
```

To use a custom template for a component, provide a `template` field to the configuration object during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({
            template: html`
                <p>A completely new template</p>
            `
        })
    )
```

Styles for a component can be configured as well, by providing a `styles` field to the configuration object during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({
            styles: css`
                /* completely replace the original styles */
            `
        })
    )
```

You can also use this technique to extend the existing styles; call the style function to import the originals and compose those with new styles. Here's what that would look like:

```ts
provideDesignSystem()
    .register(
        alphaButton({
            styles: (ctx, def) => css`
                ${buttonStyles(ctx, def)}
                /* add your style augmentations here */
            `
        })
    )
```
Shadow options can be configured as well, including both [shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) and [focus delegation](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus):

```ts
provideDesignSystem()
    .register(
        alphaButton({
            shadowOptions: {
                mode: 'closed',
                delegatesFocus: true
            }
        })
    );
```

For more information on shadow options, see [Element.attachShadow()](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).

:::tip key take-away
You can register your own design system to make your app(s) look and feel cohesive accross the organization, following your company design guidelines.

Other developers will simply reuse the same design system.
:::


### Exercise 4.2 Overriding some components using Design System
<!--
this is pretty much here: https://github.com/genesislcap/clarity-web/blob/develop/packages/apps/clarity/src/components/components.ts
  ====> provideZeroDS
-->
:::info ESTIMATED TIME
40 mins
:::
We've been using components from Genesis Zero Design System, such as ***zero-select***, ***zero-text-field***, ***zero-button*** and so on. 

Override the Zero design system, registering a new style for the ***zero-button*** so that its background color is green.

Additionally, register your own design system called **ui-training** and a new component `<ui-training-text-field>` whose font color is blue. Use this component in the order screen.


## Micro Front-ends

The [Micro-front-end](/front-end/micro-front-ends/introduction/) architecture is a design approach in which a front-end app is decomposed into individual, semi-independent **micro applications** working loosely together. There are re-usable micro-front-ends that can be used by Genesis-powered applications, such as [Foundation Header](/front-end/micro-front-ends/foundation-header/) (covered in [Day 1](#)), [Entity Management](/front-end/micro-front-ends/foundation-entity-management/) (pretty much covered in the [Developer Training](#)), [User Management](#user-management), and [Front-end reporting](#front-end-reporting).

Let's take a look at the User Management and Reporting Micro Front-ends.

:::info list of all available Micro Front-ends
[All micro Front-ends](/front-end/micro-front-ends/introduction/)
:::

### User Management

The [User Management](/front-end/micro-front-ends/foundation-user-management/) micro front-end is used to manage the users on the front end. Two core components are used to manage the entities `grid`(uses [ag-grid](https://www.ag-grid.com/)) and `form`.

:::info
User Management is a concrete use case of the [Entity Management](/front-end/micro-front-ends/foundation-entity-management/) micro front-end, which is provided as part of `foundation-ui`.
:::

To enable this micro front-end in your application, follow the steps below:

- Add `@genesislcap/foundation-entity-management` as a dependency in your *package.json* file. Whenever you change the dependencies of your project, ensure you run the bootstrap command again.

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

You can customise the functionality of User Management through the properties you set in the html. The primary way to configure the User Management functionality is via the columns that are displayed on the grid.

```javascript
// Default usage, will contain the "default" columns:
//    username, first name, last name, email, last login
// as well as the additional entity and status columns
<user-management></user-management>
```

The default columns are contained in the [UserColumnConfig](/front-end/micro-front-ends/foundation-entity-management_apiref/foundation-entity-management.userscolumnconfig) variable. The `Entity` and `Status` columns are always added to the grid.

To configure the columns yourself, set the `columns` attribute when you define the User Management in the html. You can mix in your custom column config with the default user columns config using the javascript `spread` operator.
```javascript
// Custom usage, will contain the "default" columns:
//    username, first name, last name, email, last login
// the custom "userColumns"
// as well as the additional entity and status columns
<user-management :columns=${() => [...UsersColumnConfig, ...userColumns]}>
</user-management>
```

Further information about User Management API Ref (such as `Permissions` or `persist-column-state-key`) can be found [here](/front-end/micro-front-ends/foundation-entity-management_apiref).


### Exercise 4.3 Add the User Management into the application
:::info ESTIMATED TIME
30 mins
:::

Add the User Management into the application.


### Front-end reporting

The [Front-end reporting](/front-end/micro-front-ends/front-end-reporting/) component enables your users to create report specifications, run them, or save them for later use. From the GUI, users can:

- select columns from existing data sources
- save the report with a name and retrieve it for future use
- apply ad hoc filtering to a report
- export the report results to .csv  format

#### Server configuration

This component requires a server side module to be installed and running. Luckily, this is already available in the WSL training distro you're using.

To make data available to users so that they can create reports, you must insert entries into the `REPORT_DATASOURCES` table. This table determines which data resources can be reported on.

The Report Server adds the following metadata services:

- ALL_SAVED_REPORTS (Data Server)
- SAVED_REPORTS (Request Response)
- ALL_REPORT_DATASOURCES (Request Response)

#### Front-end configuration
 
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

### Exercise 4.4 Creating a new ALL_POSITIONS Report
:::info ESTIMATED TIME
25 mins
:::
Create a new report using the ALL_POSITIONS query in the Data Server.


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

### Exercise 4.5 Adding a AgGrid to list Counterparties in our Angular solution
<!--
this is pretty much here: https://docs.genesis.global/secure/tutorials/training-resources/training-content-day3/#ui-configuring
-->
:::info ESTIMATED TIME
30 mins
:::

It is your time! Let's use AgGrid in [@genesislcap/foundation-zero](/tutorials/training-resources/training-content-day2/#genesislcapfoundation-zero) Genesis package presented before. The grid should list Counterparties in our Angular solution.

You can use the Data Server query `ALL_COUNTERPARTIES` to do that.
