---
id: getting-started
sidebar_label: Getting started
sidebar_position: 20
title: Getting started
---

To start using a design system you will need to provide it to the application. This page explains how to do it.

import DSNameMessage from '../_includes/_ds-name-message.md'

<DSNameMessage />

## Providing design system

Depending on your project needs you can choose to provide one or more design systems.

:::tip
You can switch between light and dark modes using `baseLayerLuminance` token without the need for separate design systems. See [colour tokens](/web-ui-reference/design-systems/tokens/colour/) for more details.
:::

### Single system

This is by far the most common scenario. You can provide design system to the whole application as follows:

```ts
import { provideDesignSystem } from '@genesislcap/alpha-design-system';

provideDesignSystem();
```

### Multiple systems

When providing multiple systems you can limit their scope by specifying a root DOM element for each:

```ts
import { provideDesignSystem as provideAlpha } from '@genesislcap/alpha-design-system';
import { provideDesignSystem as provideBeta } from '@genesislcap/beta-design-system';

const rootA = document.querySelector('#rootA');
provideAlpha(rootA);

const rootB = document.querySelector('#rootB');
provideBeta(rootB);
```

Note that this will limit the scope of the design system styles. If you register any components, they will be available throughout the document (e.g. you would be able to use `betaButton` outside of `#rootB`). This is because component registry applies to the whole document.

## Register components

Each design system comes with a set of components, which need to be [registered](/web-ui-reference/components/getting-started/#register-components) prior to being used. 

import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!../../../examples/ui/alphaImports';

<CodeBlock className="language-ts">{Example}</CodeBlock>

At this point your design system and component setup is complete. You can use them as is or [customise them](/web-ui-reference/design-systems/customisation/general/).
