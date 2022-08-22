---
title: 'Accordion'
sidebar_label: 'Accordion'
id: accordion
---

An accordion is a vertically stacked set of interactive headings representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.

## Set-up

```ts
import { provideDesignSystem, alphaAccordion, alphaAccordionItem } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAccordion(), alphaAccordionItem());
```

## Usage

```html live
<alpha-accordion>
  <alpha-accordion-item expanded>
    <span slot="heading">Panel one</span>
    Panel one content
  </alpha-accordion-item>
  <alpha-accordion-item>
    <span slot="heading">Panel two</span>
    Panel two content
  </alpha-accordion-item>
  <alpha-accordion-item>
    <span slot="heading">Panel three</span>
    Panel three content
  </alpha-accordion-item>
</alpha-accordion>
```

## Use cases

* Presenting multiple sections of content

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#accordion)