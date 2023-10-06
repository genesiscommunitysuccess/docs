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

## Methods

When you use an `<alpha-banner>`, you can use the following method:

| Name    | Description          |
|---------|----------------------|
| dismiss | Dismisses the banner |

## Slots

When you use an `<alpha-banner` you can use the following slots

| Name    | Description                                                                   |
|---------|-------------------------------------------------------------------------------|
| content | The content to be displayed on the left side of the component                 |
| action  | Defined the action components to be placed on the right side of the component |

## Usage

All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration of this component accordingly.

- **Example 1**: A banner with no action buttons with a content slot
```html title="Example 1"
<alpha-banner>
    <div slot="content">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet. Lorem, ipsum dolor.
    </div>
</alpha-banner>
```
- **Example 2**: a banner with two action buttons and a content slot
```html title="Example 2"
<alpha-banner>
    <div slot="content">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet. Lorem, ipsum dolor.
    </div>
    <alpha-button slot="action" appearance="lightweight">Ignore</alpha-button>
    <alpha-button slot="action" appearance="lightweight">Diagnose</alpha-button>
</alpha-banner>
```

### Interaction

#### Dismiss a banner
When you place a banner, you can use the method `dismiss` to remove the banner. Bellow you see how to use this method

1. Import the `alphaBanner` from `@genesislcap/alpha-design-system`:

``` typescript
import { alphaBanner } from '@genesislcap/alpha-design-system';
```
:::note
If you are using `foundation-zero`, then you need to import using `@genesislcap/foundation-zero`
:::

After that, you need to define the local variable to be referred to, in this case `localBanner`:

```js {3}
export class TEMPLATE extends FASTElement {
    ...
    localBanner: alphaBanner;
    ...
}
```
2. Create a function `dismissBanner()` into the class of the component:

```js {1,5}
export class TEMPLATE extends FASTElement {
    ...
    dismissBanner(){
        this.localBanner.dismiss();
    }
    ...
}
```

3. Create an action slot to dismiss the banner with a button:

```html tile="Example 4" {1,4}
<alpha-banner ${ref('localBanner)}>
    <div slot="content">
        This is a banner
    </div>
    <alpha-button slot="action" appearance="lightweight" @click=${(x) => x.dismissBanner()}>Close banner</alpha-button>
</alpha-banner>
```

From this point, if you click no the button **Close banner**, the banner will be removed with a transition.

#### Create a banner
Normally you would prefer to choose when your banner appears to your user. But if you create the Banner, it will automatically
show up in your application. In that case, here is an example of how to create this component to appear whenever you wish:


1. Import the `alphaBanner` from `@genesislcap/alpha-design-system`:

``` typescript
import { alphaBanner } from '@genesislcap/alpha-design-system';
```
:::note
If you are using `foundation-zero`, then you need to import using `@genesislcap/foundation-zero`
:::

After that, you need to define the local variable to be referred to, in this case `localBanner`:

```js {3}
export class TEMPLATE extends FASTElement {
    ...
    localBanner: alphaBanner;
    ...
}
```

3. Create a ``

## Try yourself

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
