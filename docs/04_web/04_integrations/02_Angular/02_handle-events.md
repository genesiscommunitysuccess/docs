---
title: 'Angular - Handle events'
sidebar_label: 'Handle events'
id: angular-passing-data
keywords: [web, integrations, angular, handle events]
tags:
    - web
    - integrations
    - angular
---

In this section, we will deal with handling events emitted by web components in an Angular application. It is worth noting that handling events from web components is not significantly different from handling events from Angular components themselves.

## Configuration

The base of our application is a standard Angular project initialized with
```shell
ng new alpha-handle-events
```

Next install the Genesis Foundation packages. Run this command from your project folder:

```shell
npm install --save @genesislcap/alpha-design-system
```

The next step involves the integration of a web component named `flyout`. 

The `flyout` component is designed to display an additional sliding layer on the page. It accepts an attribute named `closed`. When this attribute is set to `false`, the layer becomes visible. Notably, the component emits a `closed` event when the close button is clicked.

To register the `<alpha-flyout>` component, open your **src/main.ts** file and add the following code:

import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!/examples/ui/alphaFlyoutImports';

<CodeBlock className="language-ts">{Example}</CodeBlock>

## Preparing the Angular Component

We will prepare an Angular component that will interact with the `flyout` web component. Our Angular component will maintain a boolean variable, responsible for controlling the display of the `flyout`. This boolean will be bound to the `closed` attribute of the `flyout` component.

Your component file **/src/app/app.components.ts** should look like:

import ExampleFlyout from '!!raw-loader!/examples/ui/angular/flyout.ts';

<CodeBlock className="language-ts">{ExampleFlyout}</CodeBlock>

Component contains the following properties and methods:

- `displayFlyout`: A boolean property that determines the visibility of the `flayout` component. It is initialized to `false`, indicating that the `flayout` is not visible initially.

- `showFlyout()`: A method that sets the `displayFlyout` property to `true`. When this method is invoked, the `flayout` becomes visible. This method can be triggered by user actions, such as clicking a button, to show the `flayout`.

- `hideFlyout()`: A method that sets the `displayFlyout` property to `false`. When this method is called, it hides the `flayout`. This can be used in response to certain events, for example, when a user clicks the 'close' button on the `flayout`, indicating the intention to hide it.

These methods provide a simple interface for showing and hiding the `flayout`, effectively controlling the component's visibility based on user interactions.

The component's html (**/src/app/app.components.html**) should look like this:

import ExampleFlyoutHtml from '!!raw-loader!/examples/ui/angular/flyout.html';

<CodeBlock className="language-html">{ExampleFlyoutHtml}</CodeBlock>
Here's a breakdown of the template's structure and functionality:

- **Show flyout button**:
    ```html
    <button (click)="showFlyout()">show Flyout</button>
    ```
    - A button element that, when clicked, triggers the `showFlyout()` method. This method sets the `displayFlyout` property to `true`, making the `alpha-flyout` visible.

- **alpha-flyout Component**:
    ```html
    <alpha-flyout
        position="right"
        (closed)="hideFlyout()"
        [closed]="!displayFlyout"
    >
        Flyout content
    </alpha-flyout>
    ```
    - The `alpha-flyout` component is a custom web component responsible for displaying additional content in a flyout panel.
    - `position="right"`: This attribute sets the position of the flyout. In this case, the flyout is positioned to the right.
    - `(closed)="hideFlyout()"`: An event binding that listens for the `closed` event emitted by the `alpha-flyout`. When this event occurs (typically when the user clicks a close button within the flyout), the `hideFlyout()` method is invoked, setting `displayFlyout` to `false` and hiding the flyout.
    - `[closed]="!displayFlyout"`: A property binding that binds the `closed` property of the `alpha-flyout` to the negation of the `displayFlyout` property in the component class. This ensures that the flyout's visibility is controlled by the `displayFlyout` property.

The structure of this template facilitates the interaction between the Angular component and the `alpha-flyout` web component, providing a seamless user experience for showing and hiding additional content on demand.

Replace the contents of the **app/app.component.css** file with this:
```css
.content {
  background: #222;
  color: #FFFFFF;
  height: 100vh;
}

button {
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
}

alpha-flyout {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}

alpha-flyout::part(flyout) {
  width: 40%;
  min-width: 320px;
  padding: 0;
}

alpha-flyout::part(content) {
  height: 100%;
}
```

For a better look, you can change the body in the file **src/index.html** to:

```html
<body style="padding:0;margin:0;">
```



Now let's run our app in dev mode with:
```shell
ng serve --open
```

## Congratulations!

🎉 Congratulations on successfully integrating and handling events with a web component from Foundation UI in your Angular application! 🎉

![Angular flyout demo](/integrations/angular/angular-flyout-demo.gif)

[repository with working code from the example](https://github.com/genesiscommunitysuccess/integration-examples/tree/main/angular/alpha-handle-events)