---
title: 'Angular - Sharing data'
sidebar_label: 'Sharing data'
id: angular-sharing-data
keywords: [web, integrations, angular, sharing-data]
tags:
    - web
    - integrations
    - angular
---
This section of the documentation explores how to pass data from an Angular application to web components. Understanding the nuances of sharing data is crucial for seamless integration and functionality. We will discuss how to pass both primitive and non-primitive values.

## Passing Values (Primitive and Non-Primitive)

In Angular, both primitive values (such as strings, numbers, and boolean values) and non-primitive values (like objects and arrays) can be passed directly as attributes from Angular to web components, similar to how data is passed to Angular components.

### Primitive Values
For primitive values like strings, numbers, and boolean values (`true`/`false`), you can bind them in the HTML template like so:

```html
<your-web-component stringProp="Hello" numberProp="123"></your-web-component>
```

For boolean values, use Angular's property binding to ensure the correct boolean value is passed:

```html
<your-web-component [booleanProp]="true"></your-web-component>
```

### Non-Primitive Values (Objects and Arrays)
For non-primitive values such as objects and arrays, you can also pass them directly, leveraging Angular's property binding. Here's how you can do it:

```html
<your-web-component [objectProp]="{ key: 'value' }" [arrayProp]="[1, 2, 3]"></your-web-component>
```

Ensure that the properties (`objectProp` and `arrayProp` in the example) are properly defined in your web component to accept the data types being passed.

## Conclusion

Mastering data sharing between Angular and web components simplifies the process of building dynamic and interactive web applications. Whether dealing with simple primitives or complex objects and arrays, Angular provides robust solutions to integrate seamlessly with web components, paving the way for a flexible and scalable application architecture.

Remember to test thoroughly and ensure data integrity when passing complex data structures to maintain application stability and performance.
