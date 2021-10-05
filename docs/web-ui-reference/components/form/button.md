---
id: button
title: Button
sidebar_position: 10
---

<div class="button-examples">

Button component enables users to trigger actions, such as submitting a form or opening a dialog.

## Setup

```ts
import { provideDesignSystem, alphaButton } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaButton());
```

## Usage

```html live
<alpha-button>Button</alpha-button>
```

## Apperance

Button supports several visual appearances (accent, lightweight, neutral, outline, stealth):

```html live
<div>
  <alpha-button appearance="neutral">Button</alpha-button>
  <alpha-button appearance="accent">Button</alpha-button>
  <alpha-button appearance="lightweight">Button</alpha-button>
  <alpha-button appearance="outline">Button</alpha-button>
  <alpha-button appearance="stealth">Button</alpha-button>
</div>
```

Additionally, the following Rapid UX visual appearances are supported:

### Rapid UX Primary

```html live
<>
  <alpha-button appearance="primary-purple">Primary Purple Button</alpha-button>
  <alpha-button appearance="primary-gradient">Primary Gradient Button</alpha-button>
  <alpha-button appearance="primary-blue">Primary Blue Button</alpha-button>
  <alpha-button appearance="outline-primary-gradient">Outline Primary Gradient Button</alpha-button>
</>
```

### Rapid UX Secondary

```html live
<>
  <alpha-button appearance="secondary-teal">Secondary Teal Button</alpha-button>
  <alpha-button appearance="outline-secondary-teal">Outline Secondary Teal Button</alpha-button>
</>
```

### Rapid UX Neutral

```html live
<alpha-button appearance="neutral-grey">Neutral Grey Button</alpha-button>
```

## Disabled

Disabled buttons prevent user interaction: they cannot be pressed or focused.

```html live
<>
  <alpha-button appearance="neutral" disabled>Button</alpha-button>
  <alpha-button appearance="accent" disabled>Button</alpha-button>
  <alpha-button appearance="lightweight" disabled>Button</alpha-button>
  <alpha-button appearance="outline" disabled>Button</alpha-button>
  <alpha-button appearance="stealth" disabled>Button</alpha-button>
</>
```

## Icons

For simplicity, this example shows SVG data embedded inline. Typically you would import it from an external file.

```html live
<alpha-button appearance="neutral">
    Download
    <span slot="start" class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="15" viewBox="0 0 11 15">
        <path d="M10.4309 13.8721C10.7451 13.872 11 14.1238 11 14.4345C11 14.7452 10.7454 14.9971 10.4312 14.9972L0.56913 15C0.254899 15.0001 0 14.7483 0 14.4376C0 14.127 0.25457 13.875 0.568801 13.8749L10.4309 13.8721ZM5.42279 0.0051353L5.5 0C5.78804 0 6.0261 0.211628 6.06377 0.486201L6.06897 0.562533L6.06821 10.8269L8.89165 8.03648C9.09367 7.83679 9.40976 7.81866 9.63248 7.98209L9.69629 8.03656C9.89827 8.23629 9.9166 8.54881 9.7513 8.76901L9.69621 8.8321L5.90489 12.5798C5.70299 12.7794 5.38711 12.7976 5.16438 12.6344L5.10057 12.58L1.30485 8.83233C1.08251 8.6128 1.08226 8.25662 1.3043 8.03679C1.50616 7.83694 1.82224 7.81857 2.04509 7.98182L2.10894 8.03625L4.93028 10.8216L4.93103 0.562533C4.93103 0.277745 5.14508 0.0423843 5.42279 0.0051353L5.5 0L5.42279 0.0051353Z"/>
      </svg>
    </span>
</alpha-button>
```

## Use cases

* Creating simple button or link elements

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#button)

</div>