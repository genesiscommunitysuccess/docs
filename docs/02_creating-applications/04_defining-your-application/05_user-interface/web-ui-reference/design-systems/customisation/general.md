---
id: general
title: Customising a design system 
sidebar_label: General
sidebar_position: 10
hide_table_of_contents: true
---

Our design systems and components are highly configurable. Let's have a look at how you can take advantage.

Design system can be shared across multiple applications. When performing customisations, you can control the scope as follows:

* General - applied to the design system itself and affects all applications using the system. Described below.
* [Application-specific](/creating-applications/defining-your-application/user-interface/web-ui-reference/design-systems/customisation/app-specific/) - only applied to a single application. Other applications using the same system are not affected.

### Configuring defaults

The starting point for making general customisations is the `src/_config` folder:

```bash
alpha-design-system
├── dist
├── node_modules
├── src
│   ├── _config
│   │   ├── styles
│   │   │   ├── colors.ts
│   │   │   └── index.ts
│   │   ├── tokens
│   │   │   ├── custom.ts
│   │   │   ├── default.ts
│   │   │   └── index.ts
│   │   ├── values
│   │   │   ├── color.ts
│   │   │   ├── index.ts
│   │   │   ├── misc.ts
│   │   │   ├── sizing.ts
│   │   │   └── typography.ts
│   │   └── index.ts
```

It contains configuration files that set default values for various design tokens, as well as a few other settings.

You can achieve major visual changes simply by modifying token defaults. There are several categories of token available:

* [Colour](/creating-applications/defining-your-application/user-interface/web-ui-reference/design-systems/tokens/colour/): base colours, dark/light mode, colour variants for interactive states (hover etc.)
* [Typography](/creating-applications/defining-your-application/user-interface/web-ui-reference/design-systems/tokens/typography/): default font family, font size and line height hierarchy
* [Sizing](/creating-applications/defining-your-application/user-interface/web-ui-reference/design-systems/tokens/sizing/): component sizing, spacing and border style
* [Miscellaneous](/creating-applications/defining-your-application/user-interface/web-ui-reference/design-systems/tokens/misc/): any other configuration options such as the naming prefix (e.g. `alpha`)

:::tip
To help you visualise how modifying tokens impacts the component look and feel, we have created a [live configuration preview](/creating-applications/defining-your-application/user-interface/web-ui-reference/design-systems/customisation/live-preview/).
:::

### Overriding default implementation

You can go beyond adjusting token values and override the default component implementation. You can choose only to  override certain aspects of a component (such as template, styles or shadom DOM options) or provide a completely custom implementation.

By default components in your design simply re-export components from the underlying foundation design system as is (exact code can vary):

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
