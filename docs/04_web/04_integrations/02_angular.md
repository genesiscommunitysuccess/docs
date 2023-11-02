---
title: 'Integrations - Angular'
sidebar_label: 'Angular'
id: angular
keywords: [web, integrations, angular]
tags:
    - web
    - integrations
    - angular
---

FoundationUI integrates nicely with Angular. Let's take a look at how you can set up an Angular project, starting from scratch.

## Setting up the Angular project

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

## Configuring packages

Next, we'll install the Genesis Foundation packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @genesislcap/alpha-design-system lodash-es
```

## Updating TypeScript Configuration

Ater installing the Genesis Foundation packages, it's important to update your TypeScript configuration: 

1. Open your project’s `tsconfig.json` file.

2. Add the skipLibCheck property under the compilerOptions section and set its value to true.

```json
{
  "compilerOptions": {
    // ... other options ...
    "skipLibCheck": true
  }
}
```

This change will take effect the next time you run your build process. Keep in mind that while this setting is helpful for development, you should thoroughly type-check other environments, such as testing or production, to catch potential issues early.

## Using the components

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

To allow an NgModule to contain Non-Angular element names and to enable form-related features in your Angular application, some additions to your `app/app.module.ts` file are necessary.

Firstly, you will need to import the FormsModule from the @angular/forms package. This module is crucial for template-driven forms in Angular, enabling the use of directives like `ngModel`.
Additionally, to support Non-Angular element names, you must include the CUSTOM_ELEMENTS_SCHEMA.

Update your `app/app.module.ts` with this:

```ts 
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({  
 imports: [
    // ... other modules ...
    FormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  // ... other NgModule properties ...
}) 
```
With these changes, your Angular module will be configured to not only accommodate Non-Angular element names but also harness the full capabilities of Angular’s template-driven forms.

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
