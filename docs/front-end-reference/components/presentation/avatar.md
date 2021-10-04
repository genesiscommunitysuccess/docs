---
id: avatar
title: Avatar
sidebar_position: 20
---


The `alpha-avatar` component is used to graphically represent a user or an object.

## Setup

```ts
import { provideDesignSystem, alphaAvatar } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAvatar());
```

## Usage

### Basic Usage

```html live
<alpha-avatar alt="User profile image" link="#" name="John Doe" shape="circle" fill="accent-primary"></alpha-avatar>
```

### Shape

```html live
<alpha-avatar alt="User profile image" link="#" name="John Doe" shape="circle" fill="accent-primary" shape="square"></alpha-avatar>
```

### Filled, Colored, and Shaped

The `fill` and `color` attributes of the _avatar_ create CSS custom properties which can be used to style the control.

```css
alpha-avatar {
  --avatar-fill-primary: #0EAFE2;
  --avatar-fill-danger: #ff0000;
  --avatar-color-light: #ffffff;
  --avatar-color-dark: #000000;
}
```

## Use cases

* Display an image or text (usually initials) of a user
