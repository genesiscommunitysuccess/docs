---
id: card
title: Card
sidebar_position: 50
---

The `alpha-card` component is a visual container without semantics, which takes children. Cards are snapshots of content that are typically used in a group to present collections of related information.

## Setup

```ts
import { provideDesignSystem, alphaCard } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaCard());
```

## Usage

```html live
<alpha-card>
  <h3>Card title</h3>
  <p>
    At purus lectus quis habitant commodo, cras. Aliquam malesuada velit a tortor. Felis orci tellus netus risus et
    ultricies augue aliquet.
  </p>
  <alpha-button>Learn more</alpha-button>
</alpha-card>
```
