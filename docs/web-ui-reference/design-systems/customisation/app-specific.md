---
id: app-specific
title: Application-specific customisation
sidebar_label: Application-specific
sidebar_position: 20
---

When performing design system customisations you can control the scope as follows:

* [General](/web-ui-reference/design-systems/customisation/general/) - applied to all applications using the system.
* Application-specific - only applied to a single application. Described below.

You can also choose to customise either all or only individual components.

## Customising all components

When you register a design system in an application, there are several configuration options which will affect all the components provided by that design system.

### Prefix

You can override the default prefix set in the `_config` folder for a specific application as follows:

```ts
import { alphaButton, provideDesignSystem } from '@genesislcap/alpha-design-system';

provideDesignSystem()
    .withPrefix('custom')
    .register(alphaButton())
```

Element can then be used in HTML using the `custom` prefix:

```html
<custom-button>Button</custom-button>
```

### Default Shadow DOM Mode

You can override the default [shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) (typically `open`, as that is both recommended and the default). You can choose to close all shadow roots by default using `withShadowRootMode()`:

```ts
provideDesignSystem()
    .withShadowRootMode('closed')
    .register(/* ... */)
```

### Name disambiguation

By default, an element registered with an already-taken name will not be re-registered with the platform. However, its element definition callback will still be invoked, allowing it to define an alternate presentation (styles and template), scoped to the DOM tree that the design system is defined on.

As a best practice, one should try to avoid registering the same component more than once. However, if your architecture makes this difficult or impossible, you can provide a custom callback to handle disambiguating the duplicate elements.

The `ElementDisambiguationCallback` will be passed the tag name being registered, the type being registered, and the type that was already registered with the tag. Your callback can then return one of three types of values:

* `string` - Return a string to select an alternate name for the element to be registered under.
* `ElementDisambiguation.definitionCallbackOnly` - This is the default callback's return value, which prevents re-registering the element but allows its callback to run and define alternate presentations for the element (styles and template). Note that having more than one presentation for the same element will trigger a slower rendering code path for elements of that type. So, it's best to avoid this unless it's absolutely needed for your application design.
* `ElementDisambiguation.ignoreDuplicate` - This option completely ignores the duplicate element and no action is taken during registration if an element with the same tag is already registered.

Here's an example custom disambiguation callback showing a couple of these options.

```ts
provideDesignSystem()
    .withElementDisambiguation((nameAttempt, typeAttempt, existingType) => {
        if (nameAttempt === "foo") {
            return "bar";
        }

        return ElementDisambiguation.ignoreDuplicate;
    })
    .register(/* ... */)
```

## Customising individual components

The APIs described above impact all components, but those options can also be configured or overridden on a per-component basis. Configuring the component itself takes priority over any design system configuration.

### Prefix

The prefix for a component can be configured for a component registration by providing a configuration object with a prefix field during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({ prefix: 'custom' })
    );
```

### Template

To use a custom template for a component, provide a `template` field to the configuration object during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({
            template: html`
                <p>A completely new template</p>
            `
        })
    )
```

### Styles

Styles for a component can be configured as well, by providing a `styles` field to the configuration object during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({
            styles: css`
                /* completely replace the original styles */
            `
        })
    )
```

It's also worth noting that this can be used to extend the existing styles, by importing the originals and composing those with new styles by calling the style function. Here's what that would look like:

```ts
provideDesignSystem()
    .register(
        alphaButton({
            styles: (ctx, def) => css`
                ${buttonStyles(ctx, def)}
                /* add your style augmentations here */
            `
        })
    )
```

### Shadow Options

Shadow options can be configured as well, including both [shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) and [focus delegation](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus):

```ts
provideDesignSystem()
    .register(
        alphaButton({
            shadowOptions: {
                mode: 'closed',
                delegatesFocus: true
            }
        })
    );
```

For more information on shadow options, see [Element.attachShadow()](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).


