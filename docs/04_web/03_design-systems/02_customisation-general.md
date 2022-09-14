---
title: 'Customisation (general)'
sidebar_label: 'Customisation (general)'
id: customisation-general
---

Our design systems and components are highly configurable. Let's have a look at how you can take advantage.

Design system can be shared across multiple applications. When performing customisations, you can control the scope as follows:

* General - applied to the design system itself, affecting all applications that use the system. This is described below.
* [Application-specific](/front-end/design-systems/customisation-app-specific/) - this is only applied to a single application. Other applications using the same system are not affected.

### Configuring defaults

The starting point for making general customisations is the `src/_config` folder:

```bash
alpha-design-system
├── dist
├── node_modules
├── src
│   ├── _config
│   │   ├── styles
│   │   │   ├── colors.ts
│   │   │   └── index.ts
│   │   ├── tokens
│   │   │   ├── custom.ts
│   │   │   ├── default.ts
│   │   │   └── index.ts
│   │   ├── values
│   │   │   ├── color.ts
│   │   │   ├── index.ts
│   │   │   ├── misc.ts
│   │   │   ├── sizing.ts
│   │   │   └── typography.ts
│   │   └── index.ts
```

It contains configuration files that set default values for various design tokens, as well as a few other settings.

You can achieve major visual changes simply by modifying token defaults. There are several categories of token available:

* [Colour](/front-end/design-systems/tokens/colour/): base colours, dark/light mode, colour variants for interactive states (hover etc.)
* [Typography](/front-end/design-systems/tokens/typography/): default font family, font size and line height hierarchy
* [Sizing](/front-end/design-systems/tokens/sizing/): component sizing, spacing and border style
* [Miscellaneous](/front-end/design-systems/tokens/miscellaneous/): other configuration options, such as the naming prefix (e.g. `alpha`)

:::tip
To help you visualise how modifying tokens impacts the component look and feel, we have created a [live configuration preview](/front-end/design-systems/preview/).
:::

### Overriding default implementation

To go beyond adjusting token values, you can override the default component implementation. You can choose only to  override certain aspects of a component (such as template, styles or shadom DOM options) or provide a completely custom implementation.

By default, components in your design simply re-export components from the underlying foundation design system as is (exact code can vary):

```ts
import {foundationButton} from '@genesislcap/foundation-ui';

export const alphaButton = () => foundationButton();
```

Instead of re-exporting the default, you can provide your own custom implementation:

```ts
import {css, FoundationElement, FoundationElementDefinition, html} from '@genesislcap/foundation-ui';

export const styles = css`
/* CSS  */
`;

export const template = html<AlphaButton>`
/* Template */
`;

interface ButtonDefinition extends FoundationElementDefinition {
  /* Any properties */
}

export class Button extends FoundationElement {
  /* Any custom logic */
}

export const alphaButton = Button.compose<ButtonDefinition>({
  baseName: 'button',
  template,
  styles
});
```
