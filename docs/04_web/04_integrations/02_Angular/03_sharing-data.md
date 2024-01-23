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
This section of the documentation explores how to pass data from an Angular application to web components. Understanding the nuances of sharing data is crucial for seamless integration and functionality. We will divide our discussion into two main categories: passing primitive values and passing non-primitive values.

## Passing Primitive Values

Primitive values such as strings, numbers, and boolean values (`true`/`false`) can be passed directly as attributes from Angular to web components, similar to how data is passed to Angular components. 

For instance, if you want to pass a string or a number to a web component, you can bind it in the HTML template like so:

```html
<your-web-component stringProp="Hello" numberProp="123"></your-web-component>
```

And for boolean values, you can use Angular's property binding to ensure the correct boolean value is passed:

```html
<your-web-component [booleanProp]="true"></your-web-component>
```

## Passing Non-Primitive Values (Objects and Arrays)

Passing non-primitive values such as objects and arrays requires a different approach. Since these data types cannot be passed directly through attributes in HTML, you need to use a reference to pass them effectively. Here's how you can do it:

1. **Create a Reference in HTML**: Use the `#referenceName` syntax to create a reference to the web component in your HTML template.

    ```html
    <your-web-component #myComponent></your-web-component>
    ```

2. **Access the Native Element in Angular**: In your Angular component, you can use `ViewChild` to access the native element of the web component. Then, you can set its properties directly.

    ```typescript
    import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

    @Component({...})
    export class YourAngularComponent implements AfterViewInit {
        @ViewChild('myComponent') myComponent: ElementRef;

        ngAfterViewInit() {
            // Assuming 'myObject' is the property you want to pass to the web component
            this.myComponent.nativeElement.myObject = { /*... your object here ...*/ };
        }
    }
    ```

This method ensures that complex data types are passed accurately and efficiently, leveraging Angular's powerful rendering and data management capabilities.

## Conclusion

Mastering data sharing between Angular and web components is a significant step towards building dynamic and interactive web applications. Whether dealing with simple primitives or complex objects, Angular provides robust solutions to integrate seamlessly with web components, paving the way for a flexible and scalable application architecture.

Remember to test thoroughly and ensure data integrity when passing complex data structures to maintain application stability and performance.
