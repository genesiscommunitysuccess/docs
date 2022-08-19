---
title: 'Disclosure'
sidebar_label: 'Disclosure'
id: disclosure
---


A _disclosure_ component is the implementation of native `details` and `summary` controls, which toggles the visibility of the extra content. Visually, it would look like a button or hyperlink beneath extra content. As defined by the W3C:

> A disclosure is a button that controls the visibility of a section of content. When the controlled content is hidden, it is often styled as a typical push button with a right-pointing arrow or triangle to hint that activating the button will display additional content. When the content is visible, the arrow or triangle typically points down.

## Set-up

```ts
import { provideDesignSystem, alphaDisclosure } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaDisclosure());
```

## Usage

```html live
  <alpha-disclosure appearance="lightweight">
    <strong slot="title">Read about Foundation UI</strong>
    <div>
      Foundation UI is a collection of technologies built on Web Components and modern Web Standards, designed to help you
      efficiently tackle some of the most common challenges in website and application design and development.
    </div>
  </alpha-disclosure>
```

## Use cases

* Revealing additional information

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#disclosure)