---
title: 'Web Components - Banner'
sidebar_label: 'Banner'
id: banner
keywords: [web, web components, banner]
tags:
    - web
    - web components
    - banner
---

`foundation-banner` extends `foundation-element`.

The `banner` displays an important, succinct message, such as actions for users to address. It requires a user action to be dismissed.

Banners should be displayed at the top of the screen, below a top app bar. They’re persistent and nonmodal, allowing the user to ignore them or to interact with them at any time. Only one banner should be shown at a time.

## Set-up

```ts
import { provideDesignSystem, alphaBanner, alphaButton } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaBanner());
provideDesignSystem().register(alphaButton());
```

## Usage

```jsx live
<alpha-banner id="js-banner">
  <div slot="content">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet. Lorem, ipsum dolor.
  </div>
  <alpha-button slot="action" appearance="lightweight" style={{marginRight: '5px'}}>Ignore</alpha-button>
  <alpha-button slot="action" appearance="lightweight">Diagnose</alpha-button>
</alpha-banner>
```

## Use cases

* warning notifications
* advertisement
* displaying a logo
