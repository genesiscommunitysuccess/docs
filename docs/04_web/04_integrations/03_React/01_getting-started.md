---
title: 'React - Getting started'
sidebar_label: 'Getting started'
id: getting-started
keywords: [web, integrations, react]
tags:
    - web
    - integrations
    - react
---

This guide walks you through setting up a React project from scratch and integrating the Genesis Foundation packages.

## Setting up the React project

Ensure that you have [Node.js](https://nodejs.org/) installed on your system.

Once you have Node.js, use the following command to create a new React project named "alpha-react" using Create React App:

```shell
npx create-react-app alpha-react
```

Navigate into your new project directory:

```shell
cd alpha-react
```

## Install the Genesis Foundation packages

1. Run this command from your project folder:

```shell
npm install --save @genesislcap/alpha-design-system
```

2. Start the app in development mode:

```shell
npm start
```

The development server launches your project and makes it available on localhost. Initially, it displays the default Create React App page.

## Integrate the Foundation UI components

1. Open your **src/App.js** file and update it to use Genesis Foundation Design System components. To do this, add the following code to import and use the `<AlphaCard>`, `<AlphaButton>`, and `<AlphaTextField>` components:

```jsx
import './App.css';
import { useState } from 'react';
import { useCustomEventListener } from './hooks/useCustomEventListener';
import { 
  provideDesignSystem, 
  alphaCard, 
  alphaButton,
  alphaTextField
} from '@genesislcap/alpha-design-system';

provideDesignSystem()
    .register(
        alphaCard(),
        alphaButton(),
        alphaTextField()
    );

function App() {
  const [value, setValue] = useState('');
  const webComponentRef = useCustomEventListener('input', (event) => {
    setValue(event.target.value);
  });

  return (
    <alpha-card>
      <h2>Genesis Foundation React</h2>
      <alpha-text-field name='exampleTextField' placeholder="Enter Some Text" ref={webComponentRef}></alpha-text-field>
      <alpha-button appearance="accent" onClick={() => console.log(value)}>Click Me</alpha-button>
  </alpha-card>
  );
}

export default App;
```

The `useCustomEventListener` hook is a custom React hook that simplifies the process of adding and removing event listeners to DOM elements. This is particularly useful when dealing with web components or other third-party UI libraries.

2. Add file `hooks/useCustomEventListener.js`: 

```js
import { useRef, useEffect } from 'react';

export const useCustomEventListener = (eventName, handler) => {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            element.addEventListener(eventName, handler);

            return () => {
                element.removeEventListener(eventName, handler);
            };
        }
    }, [eventName, handler]);

    return ref;
}

```

Here is what is happening in the code:

- **`useRef`** is used to keep a mutable reference to the DOM element. Unlike state variables in React, updating a ref does not trigger a re-render.
- **`useEffect`** manages the lifecycle of the event listener. It is responsible for setting up and tearing down the event listener. The effect runs when the component mounts; when the component unmounts, it runs the cleanup function to prevent memory leaks.
- **`addEventListener` and `removeEventListener`** are native DOM APIs that attach and detach event listeners to the DOM element.

:::note

For third-party components or libraries that require form handling, ensure that you manage the state appropriately in your React components to facilitate two-way data binding.

:::

## Styling the components

To add some styles, replace the contents of your **src/App.css** file with the following CSS:

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

🎉 Congratulations! You're now set up to use Genesis Foundation with React! 🎉


![React basic demo](/integrations/react/react-basic-demo.gif)

[repository with working code from the example](https://github.com/genesiscommunitysuccess/integration-examples/tree/main/react/alpha-react)
