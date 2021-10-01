---
id: getting-started
sidebar_label: Getting started
sidebar_position: 20
title: Getting started
---

Use [CLI](/front-end-reference/cli/) to generate a design system.

Examples below use `alpha-design-system`

To start using a Genesis design system each application needs a bit of setup code. This page explains how to provide the design system to the application, register components which you plan to use and start off by making your own components.

## Provide design system

Typically you will use a single design system for the whole application like so: 

```ts
import { provideDesignSystem } from '@genesislcap/alpha-design-system';

provideDesignSystem();
```

You can mix multiple design systems in the same application by specifying root DOM node for each system:

```ts
import { provideDesignSystem as provideAlpha } from '@genesislcap/alpha-design-system';
import { provideDesignSystem as provideBeta } from '@genesislcap/beta-design-system';

const rootA = document.querySelector('#rootA');
provideAlpha(rootA);

const rootB = document.querySelector('#rootB');
provideBeta(rootB);
```

Keep in mind that in any case all custom element names will be registered in the global registry and available everywhere, but the theme will only be applied correctly in the `#app-root`.

## Register components

The design system is shipped with a number of components. To use them you need to first register them within the design system. E.g. if you plan to use `alpha-data-grid` and `alpha-select` your code might look like this:

```ts
import {
  provideDesignSystem,
  alphaDataGrid,
  alphaDataGridCell,
  alphaDataGridRow,
  alphaSelect,
  alphaOption,
} from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaDataGrid(), alphaDataGridCell(), alphaDataGridRow(), alphaSelect(), alphaOption());
```

Each component has it's own documentation which explains how to register it and any child components which are often used together with it. Please refer to individual components documentation to learn more about it, as well as see demos and stories.





## Configuring Components

FAST Frame components are highly configurable, so let’s look at some of the opportunities for configuration that can be leveraged.

### Configuring the DesignSystem

The `DesignSystem` is the entry-point for most component configuration. It can be used to control the options for which the custom element is defined in the browser, which template and stylesheet to use, and how to disambiguate custom elements that are defined for a single element tag name.

For all APIs described in this section, the configuration overrides apply to all components registered to the DesignSystem except when the option is explicitly provided during component registration. 

## Configuring Styles

FAST Frame is designed to be stylistically flexible, allowing dramatic changes to visual design with minimal code changes. This is possible through the extensive use of design tokens and an adaptive color system.

### FAST Frame Design Tokens

FAST exposes the following Design Tokens that can be used to configure components stylistically. This section describes the non-color related Design Tokens. For Design Tokens related to color, see the [adaptive color system section](/front-end-reference/design-systems/colour-tokens/)








## Using the Rapid Design System {#step-1}

At a code level, rapid is referred to as `zero`. We have plans to consolidate this to align with the UX codename `rapid`
in the very near future. Before you can use the design system in your application, you need to register it and the
components you wish to use. Omitted components won't be bundled; this is designed to reduce the size of your application.

```typescript
import {
  provideZeroDesignSystem,
  zeroDesignSystemProvider,
  baseZeroComponents,
} from '@genesislcap/foundation-zero';

provideZeroDesignSystem()
    .register(
        zeroDesignSystemProvider(), // Registers the <zero-design-system-provider> custom element
        baseZeroComponents, // Registers all our components in one go, but you can pick and choose
    );
```

## Adding elements to HTML

Once you've registered the components, they are  available for use in your document (or template).
You can use the new elements like any other HTML element:

```html
<zero-button>Hello World</zero-button>
```

With the provider custom element registered, you can also declaratively set design-system properties for specific child
nodes, and you can deeply nest these in any way you like. Components will use token values from their nearest design-system provider ancestor, or from programmatically set values.

```html
<zero-button>Small Button</zero-button>
<zero-checkbox>Small Checkbox</zero-checkbox>
<zero-design-system-provider design-unit="7" corner-radius="4">
    <zero-button>Larger Rounded Button</zero-button>
    <zero-checkbox>Larger Rounded Checkbox</zero-checkbox>
</zero-design-system-provider>
```

:::tip

You don't have to add the `<zero-design-system-provider>` to your markup. You just need to ensure the components you
wish to use have been registered with the provider as in the [first step](#step-1).

:::

## Customising the Rapid Design System

You can programmatically set design tokens to affect the entire application, or just a single element and its children.

```html
<zero-card id="my-card">
    <h1>My Card</h1>
    ...
    <zero-button @click="${x => x.handlePreview()}">Preview</zero-button>
</zero-card>
```

```typescript
import {accentPalette, PaletteRGB, SwatchRGB} from '@microsoft/fast-components';
import {parseColorHexRGB} from '@microsoft/fast-colors';

const myAccentBaseSwatch = SwatchRGB.from(parseColorHexRGB('#FFCC00'));
const myAccentPalette = PaletteRGB.create(myAccentBaseSwatch);

// For every element in the app as we're changing the default...
accentPalette.withDefault(myAccentPalette);

// For only the target element and its children, ie. the zero-button too.
const targetElement = document.querySelector('#my-card') as HTMLElement; 
accentPalette.setValueFor(targetElement, myAccentPalette);
```

This, combined with the declarative approach, is very powerful. 

:::tip

You can also delete values applied to nodes to cause them to retrieve the nearest ancestor value instead.

```typescript
accentPalette.deleteValueFor(targetElement);
```

:::

## Runtime configuration

Design systems are parameterised and can be configured at runtime.

TODO: Artur's design system widget?

