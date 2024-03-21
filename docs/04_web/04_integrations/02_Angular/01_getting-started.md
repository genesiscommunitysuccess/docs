---
title: 'Angular - Getting started'
sidebar_label: 'Getting started'
id: getting-started
keywords: [web, integrations, angular]
tags:
    - web
    - integrations
    - angular
---

FoundationUI integrates nicely with Angular. Let's take a look at how you can set up an Angular project, starting from scratch.

## Setting up the Angular project

First, make sure that you have [Node.js](https://nodejs.org/) installed. 

With Node.js installed, run the following command to install the Angular CLI:

```shell
npm install -g @angular/cli
```

With the CLI installed, you have access to the `ng` command-line interface. This can be used to create a new Angular project. For example, to create a new Angular App named "alpha-angular", use the command:

```shell
ng new alpha-angular
```

Follow the prompts, answering each question in turn. At the end, you should have a basic runnable Angular application.

## Use Genesis Foundation packages

To install the Genesis Foundation packages. Run this command from your project folder:

```shell
npm install --save @genesislcap/alpha-design-system
```

Now let's run our app in dev mode:
```shell
ng serve --open
```

The Angular CLI should build your project and make it available on localhost. Right now, it displays a basic welcome message, since we haven't added any code or interesting HTML.

Let's change that. Open your **src/main.ts** file and add the following code:

import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!/examples/ui/alphaImports';

<CodeBlock className="language-ts">{Example}</CodeBlock>

This code uses the Genesis Foundation Design System to register the `<alpha-card>`, `<alpha-button>` and `<alpha-text-field>` components.

Once you have saved the file, the dev server is rebuilt and your browser is refreshed. However, you still won't see anything. To see the user interface, you need to write some HTML that uses our components. Replace the HTML template in your **app/app.component.html** file with the following markup:

import BasicExampleHtml from '!!raw-loader!/examples/ui/angular/basic.html';

<CodeBlock className="language-html">{BasicExampleHtml}</CodeBlock>

:::note

Third-party controls require a ControlValueAccessor for writing a value and listening to changes on input elements. Add the `ngDefaultControl` attribute to your component to set up two-way binding with the `FormControlDirective`, `FormControlName`, or `NgModel` directives:

:::

Replace the code in your **app/app.component.ts** file with this:

import BasicExampleComponent from '!!raw-loader!/examples/ui/angular/basic.ts';

<CodeBlock className="language-ts">{BasicExampleComponent}</CodeBlock>

In the above code, this code enables you to use non-angular elements (web components) in an Angular component ([read more](https://angular.io/api/core/CUSTOM_ELEMENTS_SCHEMA)).:

```ts
standalone: true,
schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
```

In our example, we use [`ngModel`](https://angular.io/api/forms/NgModel#description). So, to enable form-related features in the Angular application, we added:
```ts
  imports: [
    FormsModule,
  ],
```
These changes configure your Angular component to accommodate Non-Angular element names and to harness the full capabilities of Angular’s template-driven forms.

To add a splash of style, replace the contents of the **app/app.component.css** file with this:

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
## Congratulations!

🎉 Congratulations! You're now set up to use Genesis Foundation and Angular! 🎉

![Angular basic demo](/integrations/angular/angular-basic-demo.gif)

[repository with working code from the example](https://github.com/genesiscommunitysuccess/integration-examples/tree/main/angular/alpha-angular)
