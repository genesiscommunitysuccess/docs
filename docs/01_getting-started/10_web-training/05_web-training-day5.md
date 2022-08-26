---
id: web-training-day5
title: Day 5
sidebar_label: Day 5
sidebar_position: 8
---
This day covers:

- [Using more micro frontend](#custom-endpoints)
- [Angular integration​](#camel-module)

## Using more micro frontend

Micro-front-end architecture is a design approach in which a front-end app is decomposed into individual, semi-independent **micro applications** working loosely together. The micro-front-end concept is vaguely inspired by, and named after, microservices. Independent development teams can collaborate on a front-end app more easily using this approach, and can each have their own release cadence. We've built out a number of re-usable micro-front-ends that can be used by Genesis-powered applications.

### Header

### Config

### Reporting

https://internal-web/uat/secure/front-end/micro-front-ends/front-end-reporting/

#### Exercise 5.1 Using a custom micro frontend

<!--
this is pretty much here: 
-->
:::info ESTIMATED TIME
30 mins
:::

We are building ....

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

#### Exercise 5.2 Adding a AgGrid to list Counterparties in our Angular solution
<!--
this is pretty much here: https://docs.genesis.global/secure/tutorials/training-resources/training-content-day3/#ui-configuring
-->
:::info ESTIMATED TIME
30 mins
:::

It is your time! Let's use AgGrid in [@genesislcap/foundation-zero](/tutorials/training-resources/training-content-day2/#genesislcapfoundation-zero) Genesis package presented before. The grid should list Counterparties in our Angular solution.

You can use the Data Server query `ALL_COUNTERPARTIES` to do that.
