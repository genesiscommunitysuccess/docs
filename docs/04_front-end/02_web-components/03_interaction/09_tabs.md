---
title: 'Tabs'
sidebar_label: 'Tabs'
id: tabs
---

_Tabs_ are a set of layered sections of content that display one panel of content at a time. Each tab panel has an associated tab element that, when activated, displays the panel. The list of tab elements is arranged along one edge of the currently displayed panel.

## Set-up

```ts
import { provideDesignSystem, alphaTabs, alphaTab, alphaTabPanel } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTabs(), alphaTab(), alphaTabPanel());
```

## Usage

```html live
<alpha-tabs activeid="entrees">
  <alpha-tab id="apps">Appetizers</alpha-tab>
  <alpha-tab id="entrees">Entrees</alpha-tab>
  <alpha-tab id="desserts">Desserts</alpha-tab>
  <alpha-tab-panel id="appsPanel">
    <ol>
      <li><alpha-anchor href="#" appearance="hypertext">Stuffed artichokes</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Bruschetta</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Oven-baked polenta</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Salami and Fig Crostini with Ricotta</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Rosemary-Potato Focaccia with Goat Cheese</alpha-anchor></li>
    </ol>
  </alpha-tab-panel>
  <alpha-tab-panel id="entreesPanel">
    <ol>
      <li><alpha-anchor href="#" appearance="hypertext">Mushroom-Sausage Ragù</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Tomato Bread Soup with Steamed Mussels</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Grilled Fish with Artichoke Caponata</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Celery Root and Mushroom Lasagna</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Osso Buco with Citrus Gremolata</alpha-anchor></li>
    </ol>
  </alpha-tab-panel>
  <alpha-tab-panel id="dessertsPanel">
    <ol>
      <li><alpha-anchor href="#" appearance="hypertext">Tiramisu</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Spumoni</alpha-anchor></li>
      <li><alpha-anchor href="#" appearance="hypertext">Limoncello and Ice Cream with Biscotti</alpha-anchor></li>
    </ol>
  </alpha-tab-panel>
</alpha-tabs>
```

## Use cases

* Information grouping
* Wizard steps

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#tabpanel)