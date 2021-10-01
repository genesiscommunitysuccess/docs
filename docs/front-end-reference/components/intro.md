---
id: intro
sidebar_label: Introduction
sidebar_position: 10
title: Components
tags:
  - components
  - frontend
  - ui
---

## Using Genesis Foundation UI Components

### Create a `DesignSystem`

Web components from Genesis Foundation UI  must be registered with the `DesignSystem` prior to being used in HTML. To set up the `DesignSystem`, first import and invoke the provider function from `@microsoft/fast-foundation` to get the `DesignSystem` instance. Then import the registrations of the components you want to use from `@microsoft/fast-components` and register them with the `DesignSystem`:

```ts
import { 
    fastButton, 
    fastMenu, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton(),
        fastMenu()
    );
```

### Add Element to HTML

Once you've registered the components as shown above, they are now available for use in your document (or template). Just use the new elements like any other HTML element:

```html
<fast-button>Click me!</fast-button>
```

### Hide undefined elements

Custom Elements that have not been [upgraded](https://developers.google.com/web/fundamentals/web-components/customelements#upgrades) and don't have styles attached can still be rendered by the browser but they likely do not look how they are supposed to. To avoid a *flash of un-styled content* (FOUC), visually hide Custom Elements that are not yet defined:

```CSS
:not(:defined) {
    visibility: hidden;
}
```

:::important
The consuming application must apply this, as the components themselves do not.
:::