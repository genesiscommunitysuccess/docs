---
id: customisation
title: Design System Customisation
sidebar_label: Customisation
sidebar_position: 30
---

Our design systems and components are highly configurable. Let's have a look at how this can be leveraged.

Design system can be shared across multiple applications. When performing customisations you can control the scope as follows:

* general - applied to all applications using the system.
* application-specific - only applied in a single application. Other applications using the same system are not affected.

## General

Starting point for making general customisations is the `_config` folder. You will find it in the root of your design system.

### Configuring defaults

You can achieve major visual changes by modifying default values of the design tokens. There are several different categories of tokens available:

* [Colour](/web-ui-reference/design-systems/colour-tokens/): base colours, dark/light mode, colour variants for interactive states (hover etc.)
* [Typography](/web-ui-reference/design-systems/typography-tokens/): default font family, font size and line height hierarchy
* [Sizing](/web-ui-reference/design-systems/sizing-tokens/): component sizing, spacing and border style
* [Miscellaneous](/web-ui-reference/design-systems/misc-tokens/): any other configuration options such as the naming prefix (e.g. `alpha`)

### Overriding default implementation

You can go beyond adjusting token values and override the default component implementation. You can choose to only override certain aspects of a component (such as template, styles or shadom DOM options) or provide a completely custom implementation.

## Application-specific

If your customisations are specific to only one application, you can apply them using the APIs described below.

### Design System

When you register a design system in an application, there are several configuration options available. They will affect all the components provided by that design system.

#### Prefix

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

#### Default Shadow DOM Mode

You can override the default [shadow root mode](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) (typically `open`, as that is both recommended and the default). You can choose to close all shadow roots by default using `withShadowRootMode()`:

```ts
provideDesignSystem()
    .withShadowRootMode('closed')
    .register(/* ... */)
```

#### Name disambiguation

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

### Components

The APIs described above impact all components, but those options can also be configured or overridden on a per-component basis. Configuring the component itself takes priority over any design system configuration.

#### Prefix

The prefix for a component can be configured for a component registration by providing a configuration object with a prefix field during registration:

```ts
provideDesignSystem()
    .register(
        alphaButton({ prefix: 'custom' })
    );
```

#### Template

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

#### Styles

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

#### Shadow Options

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


