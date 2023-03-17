---
title: "Web Components - Dropdown menu"
sidebar_label: "Dropdown menu"
id: dropdown-menu
keywords: [web, web components, dropdown menu]
tags:
  - web
  - web components
  - dropdown menu
---

`Dropdownmenu` extends `foundationElement`

A dropdown menu is a toggleable menu where wheres are allowed to chose one of its pre-defined items.


## Set-up

```ts
import { foundationDropdownMenu } from "@genesislcap/foundation-ui";
import { getExports } from "../utils";
const { defaultConfig, shadowOptions, styles, template } = getExports(
  foundationDropdownMenu
);

provideDesignSystem().register(alphaDropdowMmenu());
```

## Usage

```html live
<div>
<alpha-dropdown-menu> </alpha-dropdown-menu>
</div>
```

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#Listbox)
