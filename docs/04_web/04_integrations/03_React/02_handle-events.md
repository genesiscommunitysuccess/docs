---
title: 'React - Handle events'
sidebar_label: 'Handle events'
id: react-passing-data
keywords: [web, integrations, react, handle events]
tags:
    - web
    - integrations
    - react
---

In this section, we will delve into handling events emitted by web components in a React application. It's important to note that handling events from web components in React is similar to handling native React events.

## Configuration

The foundation of our application is a standard React project initialized with
```shell
npx create-react-app alpha-handle-events
```

Next, install the Genesis Foundation packages. Run this command from your project folder:

```shell
npm install --save @genesislcap/alpha-design-system
```

The next step involves the integration of a web component named `flyout`.

The `flyout` component is designed to display an additional sliding layer on the page. It accepts a property named `closed`. When this property is set to `false`, the layer becomes visible. Notably, the component emits a `closed` event when the close button is clicked.

To register the `<alpha-flyout>` component, open your **src/index.js** file and add the following code:

import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!/examples/ui/alphaFlyoutImports';

<CodeBlock className="language-ts">{Example}</CodeBlock>

## Preparing the React Component

We will prepare a React component that will interact with the `flyout` web component. Our React component will maintain a boolean state, responsible for controlling the display of the `flyout`. This boolean will be bound to the `closed` property of the `flyout` component.

Your component file **/src/App.js** should look like this:

```jsx
import React, { useRef } from 'react';
import './App.css';

function App() {
  const flyoutRef = useRef(null);

  const showFlyout = () => {
    flyoutRef.current.closed = false;
  };

  const hideFlyout = () => {
    flyoutRef.current.closed = true;
  };

  return (
    <div className="content">
      <button onClick={showFlyout}>Show Flyout</button>
      <alpha-flyout
        ref={flyoutRef}
        position="right"
        onClosed={hideFlyout}
      >
        Flyout content
      </alpha-flyout>
    </div>
  );
}

export default App;
```

Component contains the following properties and methods:


- `showFlyout()`: A method that sets the closed parameter to `false` on the web component by reference `flyoutRef`. When this method is invoked, the `flyout` becomes visible.

- `hideFlyout()`: A method that sets the `displayFlyout` state to `false`. When this method is called, it hides the `flyout`. This method is invoked when `alpha-flayout` emit event `closed`.

These methods provide a simple interface for showing and hiding the `flyout`, effectively controlling the component's visibility based on user interactions.

The component's CSS (**/src/App.css**) should look like this:

```css
.content {
  background: #222;
  color: #FFFFFF;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

Now let's run our app in dev mode with:
```shell
npm start
```

## Congratulations!

🎉 Congratulations on successfully integrating and handling events with a web component from Foundation UI in your React application! 🎉

![React flyout demo](/integrations/react/react-flyout-demo.gif)

[repository with working code from the example](https://github.com/genesiscommunitysuccess/integration-examples/tree/main/react/alpha-handle-events)
