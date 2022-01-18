---
id: react
title: React
sidebar_label: React
sidebar_position: 30
---

Genesis Foundation can be used in React applications. Let's take a look at how you can set up a project, starting from scratch.

## Setting up the React project

First, you'll need to make sure that you have Node.js >= 8.2 and npm >= 5.6 installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can use [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) to create a new React project.

```shell
npx create-react-app alpha-app
```

## Configuring packages

Next, we'll install the Genesis Foundation packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @genesislcap/foundation-ui @genesislcap/alpha-design-system lodash-es
```

## Configure create-react-app
[create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) ships with an [eslint](https://eslint.org/) rule that makes working with Genesis Foundation components difficult. There are two changes that will need to be made in the `package.json`:

**Set the EXTEND_ESLINT environment variable in start, build, and test scripts**
```json
{
    //...
    "scripts": {
        "start": "EXTEND_ESLINT=true react-scripts start",
        "build": "EXTEND_ESLINT=true react-scripts build",
        "test": "EXTEND_ESLINT=true react-scripts test",
    }
    // ...
}
```

**Override the `eslintConfig` field to turn off the 'no-unused-expressions' rule**
```json
{
    //..
    "eslintConfig": {
        "extends": "react-app",
        "rules": {
            "no-unused-expressions": "off"
        }
    },
    //..
}
```
See [configuring eslint](https://create-react-app.dev/docs/setting-up-your-editor#experimental-extending-the-eslint-config) for more information.

## Using the components

With all the basic pieces in place, let's run our app in dev mode with `npm start`. Right now, it displays the React logo and some editing instructions, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/app.js` file and add the following code:

import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!../../../examples/ui/alphaImports';

<CodeBlock className="language-js">{Example}</CodeBlock>

This code uses the Genesis Foundation Design System to register the `<alpha-card>` and `<alpha-button>` components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the App component in your `src/app.js` file with the following:

```jsx
function App() {
  return (
    <alpha-card>
      <h2>Genesis Foundation React</h2>
      <alpha-button appearance="accent" onClick={() => console.log("clicked")}>Click Me</alpha-button>
    </alpha-card>
  );
}
```

To add a splash of style, add the following to the `src/App.css`:

```css
alpha-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: var(--type-ramp-plus-5-font-size);
  line-height: var(--type-ramp-plus-5-line-height);
}

alpha-card > alpha-button {
  align-self: flex-end;
}
```

Congratulations! You're now set up to use Genesis Foundation and React!

## Additional notes

### create-react-app

Genesis Foundation makes use of decorators to define components. At this time, `create-react-app` [does not support decorators](https://create-react-app.dev/docs/can-i-use-decorators/). This won't be a problem when using components *imported* from Genesis Foundation because they have already been transpiled by TypeScript - but to *create* components in a `create-react-app` application you'll need to do one of the following:
- Define components without decorators (described below)
- [Eject](https://create-react-app.dev/docs/available-scripts#npm-run-eject)`create-react-app` and change Babel to support decorators 
- Use an intermediary like [react-app-rewired](https://www.npmjs.com/package/react-app-rewired)
  
#### Working without decorators

Decorators are an upcoming feature planned for a future version of JavaScript, but their design is not yet finished. While the syntax for decorator usage is not likely to change in the final version of the feature, some of our community members may feel uncomfortable using this feature at this stage. Additionally, since decorators are transpiled into code that uses helper functions (both in TypeScript and Babel) the compiled output will be larger than the equivalent non-decorator code.

While there are size implications of using decorators prior to full language support, they do present the most declarative and readable form of the API, and we recommend their use for the average project. To strike a balance between declarative readability and size, we recommend that TypeScript be used in combination with the `"importHelpers": true` compiler option. When this option is set, instead of generating helper functions for decorators into every file, TypeScript will import a set of shared helpers published in the `tslib` package.

For those that require the smallest possible builds, FAST Elements can be completely defined in Vanilla JS, without using decorators, by leveraging a static `definition` field on your class. The `definition` field only needs to present the same configuration as the `@customElement` decorator. Here's an example that shows the use of the `definition` field along with a manual call to `define` the element:

```js
import { FoundationElement, html, css } from '@genesislcap/foundation-ui';

const template = html`...`;
const styles = css`...`;
const converter = { ... };

export class MyElement extends FoundationElement {
  static definition = {
    name: 'my-element',
    template,
    styles,
    attributes: [
      'value', // same attr/prop
      { attribute: 'some-attr', property: 'someAttr' }, // different attr/prop
      { property: 'count', converter } // derive attr; add converter
    ]
  };

  value = '';
  someAttr = '';
  count = 0;
}

GenesisElement.define(MyElement);
```

:::note
The `definition` can also be separated from the class and passed into the `define` call directly if desired. Here's what that would look like: `FASTElement.define(MyElement, myDefinition);`
:::


### Data binding

#### HTML attributes

React is capable of rendering custom HTML elements and binding data to them, but it is beneficial to understand *how* React does this. 

React will apply all *props* to a custom HTML element as *HTML attributes* - including non-primitive types such as arrays and objects. Where some UI libraries provide binding syntaxes to distinguish setting properties, attributes, and events, React does not. This means that it can be very easy to end up with `my-prop="[object Object]"` in your HTML. React is exploring solutions [to this issue](https://github.com/facebook/react/issues/11347). See the section on [interop layers](#interop-layers-skatejsval-and-reactify-wc) for a work-around for this issue.

#### Custom events

React's synthetic eventing system comes with an unfortunate side-effect of being incapable of declaratively applying [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) listeners. [interop layers](#interop-layers-skatejsval-and-reactify-wc) can be used to address this issue. Alternatively, a `ref` can be used on the custom element to imperatively apply the event listener to the HTML element directly.

#### Interop layers: @skatejs/val and reactify-wc

[@skatejs/val](https://github.com/skatejs/val) is a small library that wraps React's `createElement` function and provides the ability direct React *props* explicitly to HTML attributes, DOM properties, or to declarative event listeners.

Another good option is [reactify-wc](https://github.com/BBKolton/reactify-wc). It provides similar capabilities as `@skatejs/val` but does so by creating component wrappers.

### TypeScript and TSX support

If you're using TypeScript, you'll need to augment the `JSX.IntrinsicElements` interface to use custom elements in TSX. To do so, create a `custom-elements.d.ts` file in your source directory and add the following:

```ts
// custom-elements.d.ts
declare namespace JSX {
    interface IntrinsicElements {
        /**
         *  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> allows setting standard HTML attributes on the element
         */
        "my-element": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            "my-attribute-name": string;
        };
    }
}

```
