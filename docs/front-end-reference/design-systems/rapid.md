---
id: rapid
sidebar_label: Rapid
sidebar_position: 20
title: Rapid Design System
tags:
  - design system
  - ux
  - rapid
---

## Introduction

Like all the Design Systems built by our UX teams, they start in [Axure](https://www.axure.com/) and have been lab
tested to meet the needs of our financial markets applications.
[Rapid Design System](https://n42r49.axshare.com/#id=u42cgo&p=primitives&c=1) is our initial offering that you can use
as is out of the box or customise to your needs.

## Using the Rapid Design System {#step-1}

At a code level rapid is referred to as `zero`. We have plans to consolidate this to align with the UX codename `rapid`
in the very near future. Before you can use the design system in your application you need to register it and the
components you wish to use. Omitted components won't be bundled to reduce the size of your application.

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

## Add Element to HTML

Once you've registered the components as shown above, they are now available for use in your document (or template).
Just use the new elements like any other HTML element:

```html
<zero-button>Hello World</zero-button>
```

With the provider custom element registered, you can also declaratively set design system properties for specific child
nodes, and you and deeply nest these however you like. Components will use token values from their nearest design system
provider ancestor, or programmatically set values.

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

You can programmatically set design `tokens` to effect the entire application or for a single element and its children.

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

This combined with the declarative approach is very powerful. 

:::tip

You can also delete values applied to nodes to cause them to retrieve the nearest ancestor value instead.

```typescript
accentPalette.deleteValueFor(targetElement);
```

:::

## Runtime configuration

Design systems are parameterised and can be configured at runtime.

TODO: Artur's design system widget?

