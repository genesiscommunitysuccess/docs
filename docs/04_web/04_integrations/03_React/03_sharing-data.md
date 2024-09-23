---
title: 'React - Sharing data'
sidebar_label: 'Sharing data'
sidebar_position: 3
id: react-sharing-data
keywords: [web, integrations, react, sharing-data]
tags:
    - web
    - integrations
    - react
---
This section of the documentation looks at how to pass data from a React application to web components. Understanding the details of sharing data is essential for ensuring seamless integration and interactivity. We will focus on two main categories: passing primitive values and passing non-primitive values.

## Passing primitive values

Primitive values include strings, numbers, and boolean values (`true`/`false`).

These can be passed directly as props from React to web components, which is similar to the way that data is passed between React components.

For instance, if you want to pass a string or a number to a web component, you can bind it in your JSX like this:

```jsx
<your-web-component stringProp="Hello" numberProp={123} />
```

And for boolean values, you can pass them directly as props:

```jsx
<your-web-component booleanProp={true} />
```

## Passing non-primitive values (objects and arrays)

Passing non-primitive values such as objects and arrays requires a bit more attention. These data types are not passed directly through attributes in JSX, so you need to ensure they are handled correctly. You need to use 'useRef'.

### Use useRef for references

The `useRef` hook enables you need a reference to the web component for more complex interactions (such as calling methods on the web component).

```jsx
import React, { useRef, useEffect } from 'react';

function YourReactComponent() {
    const webComponentRef = useRef(null);

    useEffect(() => {
        if (webComponentRef.current) {
            // You can interact with the web component directly
            webComponentRef.current.someMethod();
        }
    }, []);

    return (
        <YourWebComponent ref={webComponentRef} />
    );
}
```

This approach ensures that both simple and complex data types are passed accurately and efficiently, using React's JSX syntax and component architecture.

### Using reactify-wc for wrapping

The `reactify-wc` library enables you to wrap your web components and use them as if they were native React components. This integrates the web components smoothly into your React application. 

#### Example Usage

Here's how you can use `reactify-wc` in your project:

1. **Install `reactify-wc`**:
   
   ```shell
   npm install reactify-wc --force
   ```

:::note

`reactify-wc` is built with React 16, but it works correctly with newer versions of React, such as React 18 used in create react app.

:::

2. **Wrap Your Web Component**:

```jsx
import { Reactify } from 'reactify-wc';

const YourWebComponent = Reactify('your-web-component');

function App() {
    return (
        <YourWebComponent
            stringProp="Hello"
            numberProp={123}
            booleanProp={true}
            complexProps={{ data: { booleanProp: true, stringProp: '' }}} 
        />
    );
}
```

   With `reactify-wc`, you can now use `YourWebComponent` as a regular React component, passing props and handling events in a React-like manner.

### Coming soon in React 19

Looking ahead, the upcoming React 19 is expected to introduce enhanced support for web components. we can expect a simplified integration process and a more native experience when using web components in React applications. 

## Conclusion

Whether you're dealing with straightforward primitives or intricate objects, React's prop system and the `useRef` hook enable you to integrate smoothly with web components.

To maintain the stability and performance of your application, thoroughly test and validate the data being passed, especially when working with complex structures.
