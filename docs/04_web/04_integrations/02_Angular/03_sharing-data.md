---
title: 'Angular - sharing data'
sidebar_label: 'sharing data'
id: angular-sharing-data
keywords: [web, integrations, angular, sharing-data]
tags:
    - web
    - integrations
    - angular
---
This section of the documentation explores how to pass data from an Angular application to web components. It is critical to get this correct to ensure seamless integration and functionality. 

Here, we look at how to pass both primitive and non-primitive values.

## Passing values (primitive and non-primitive)

In Angular, both primitive values (such as strings, numbers, and boolean values) and non-primitive values (such as objects and arrays) can be passed directly as attributes from Angular to web components. This is similar to the way that data is passed between Angular components.

### Primitive values
You can bind primitive values in the HTML template in this way:

```html
<your-web-component stringProp="Hello" numberProp="123"></your-web-component>
```

For boolean values, use Angular's property binding to ensure the correct boolean value is passed:

```html
<your-web-component [booleanProp]="true"></your-web-component>
```

### Non-primitive values (objects and arrays)
You can also pass non-primitive values directly, using Angular's property binding. Here's how you can do it:

```html
<your-web-component [objectProp]="{ key: 'value' }" [arrayProp]="[1, 2, 3]"></your-web-component>
```

Ensure that the properties (`objectProp` and `arrayProp` in the example) are properly defined in your web component to accept the data types being passed.

## Conclusion

Sharing data between Angular and web components is simple, but it is critical to the process of building dynamic and interactive web applications. Whether dealing with simple primitives or complex objects and arrays, Angular can integrate seamlessly with web components, paving the way for a flexible and scalable application architecture.

Remember to test thoroughly and ensure data integrity when passing complex data structures to maintain application stability and performance.
