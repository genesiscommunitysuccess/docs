---
id: customising-components
title: Customising components
sidebar_position: 80
---

### Configuring Components During Registration

The DesignSystem APIs described above impact all components registered to the DesignSystem, but those options can also be configured or overridden on a per-component basis. Configuring the component itself takes priority over any DesignSystem configuration. 

#### Prefix

The prefix for a component can be configured for a component registration by providing a configuration object with a prefix field during registration:

```ts
provideFASTDesignSystem()
    .register(
        fastButton({ prefix: "faster" })
    );
```

#### Template

To use a custom template for a component, provide a `template` field to the configuration object during registration:

```ts
provideFASTDesignSystem()
    .register(
        fastButton({ 
            template: html`
                <p>A completely new template</p>
            ` 
        })
    )
```

#### Styles

Styles for a component can be configured as well, by providing a `styles` field to the configuration object during registration:

```ts
provideFASTDesignSystem()
    .register(
        fastButton({ 
            styles: css`
                /* completely replace the original styles */
            ` 
        })
    )
```

It's also worth noting that this can be used to extend the existing styles, by importing the originals and composing those with new styles by calling the style function. Here's what that would look like:

```ts
provideFASTDesignSystem()
    .register(
        fastButton({
            styles: (ctx, def) => css`
                ${buttonStyles(ctx, def)}
                /* add your style augmentations here */
            `
        })
    )
```

:::important

At present, there is a minor typing bug across all the style and template functions, so you will need to cast the second argument as follows `${buttonStyles(ctx, def as any)}`. [We have tracked this issue](https://github.com/microsoft/fast/issues/5047) and are planning a fix soon.

:::

#### Shadow Options

Shadow options can be configured as well, including both [shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) and [focus delegation](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus):

```ts
provideFASTDesignSystem()
    .register(
        fastButton({ 
            shadowOptions: {
                mode: "closed",
                delegatesFocus: true 
            }
        })
    );
```

For more information on shadow options, see [Element.attachShadow()](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).

