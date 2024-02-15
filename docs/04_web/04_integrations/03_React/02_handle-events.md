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

This section looks at how to handle events that are emitted by web components in a React application. It's important to note that handling events from web components in React is similar to handling native React events.

## Configuration

The foundation of our application is a standard React project. 

1. Initialise the using the following command:

```shell
npx create-react-app alpha-handle-events
```

2. Install the Genesis Foundation packages: run this command from your project folder:

```shell
npm install --save @genesislcap/alpha-design-system
```

3. Integrate the `flyout` web component.

This component is designed to display an additional sliding layer on the page. It accepts a property named `closed`. When this property is set to `false`, the layer becomes visible; when the close button is clicked, the component emits a `closed` event.

To register the `<alpha-flyout>` component, open your **src/index.js** file and add the following code:

import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!/examples/ui/alphaFlyoutImports';

<CodeBlock className="language-ts">{Example}</CodeBlock>

## Preparing the React component

Now prepare a React component that will interact with the `flyout` web component. The React component must maintain a boolean state, responsible for controlling the display of the `flyout`. This boolean must be bound to the `closed` property of the `flyout` component.

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

The component contains the following properties and methods:

- `showFlyout()`is a method that sets the closed parameter to `false` on the web component by reference `flyoutRef`. When this method is invoked, the `flyout` becomes visible.

- `hideFlyout()` is a method that sets the `displayFlyout` state to `false`. When this method is called, it hides the `flyout`. This method is invoked when `alpha-flayout` emits a `closed` event.

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

## Running the app

Now let's run our app in dev mode with:
```shell
npm start
```

## Congratulations!

🎉 Congratulations on successfully integrating and handling events with a web component from Foundation UI in your React application! 🎉

![React flyout demo](/integrations/react/react-flyout-demo.gif)

[repository with working code from the example](https://github.com/genesiscommunitysuccess/integration-examples/tree/main/react/alpha-handle-events)
