---
title: 'Breadcrumb'
sidebar_label: 'Breadcrumb'
id: breadcrumb
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#breadcrumb):

> A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order. It helps users find their place within a website or web application. Breadcrumbs are often placed horizontally before a page's main content.

## Set=up

```ts
import { provideDesignSystem, alphaBreadcrumb, alphaBreadcrumbItem } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaBreadcrumb(), alphaBreadcrumbItem());
```

## Usage

```html live
<alpha-breadcrumb>
  <alpha-breadcrumb-item href="#">Breadcrumb item 1</alpha-breadcrumb-item>
  <alpha-breadcrumb-item href="#">Breadcrumb item 2</alpha-breadcrumb-item>
  <alpha-breadcrumb-item>Breadcrumb item 3</alpha-breadcrumb-item>
</alpha-breadcrumb>
```

## Use cases

* Breadcrumb trail navigation

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#breadcrumb)