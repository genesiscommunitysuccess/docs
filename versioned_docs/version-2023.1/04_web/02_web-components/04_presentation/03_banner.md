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

Banners should be displayed at the top of the screen, below a top app bar. They’re persistent and nonmodal, allowing the user to ignore them or to interact with them at any time.

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

When you use an `<alpha-banner>` you can use the following slots

| Name    | Description                                                                   |
|---------|-------------------------------------------------------------------------------|
| content | The content to be displayed on the left side of the component                 |
| action  | Defined the action components to be placed on the right side of the component |

:::note
Multiple content/action slots will be placed side by side.
:::

## Usage

All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration of this component accordingly.

- **Example 1**: A banner with no action buttons with a content slot

```html title="Example 1"
<alpha-banner>
    <div slot="content">
        This is a banner
    </div>
</alpha-banner>
```

- **Example 2**: a banner with two action buttons and a content slot

```html title="Example 2"
<alpha-banner>
    <div slot="content">
        This is a banner
    </div>
    <alpha-button slot="action" appearance="lightweight">Button 1</alpha-button>
    <alpha-button slot="action" appearance="lightweight">Button 2</alpha-button>
</alpha-banner>
```

### Interaction

#### Dismiss a banner

When you place a banner, you can use the method `dismiss()` to remove the banner. Below you see how to use this method:

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

From this point, when you click on the **Close banner** button, the banner will be smoothly removed with a transition.

#### Create a banner dynamically

Normally you would prefer to choose when your banner appears to your user. But if you create the banner in your file, it will automatically
show up in your application. In that case, here is an example of how to create this component dynamically so it appears whenever you set to:

1. Import the `alphaBanner` from `@genesislcap/alpha-design-system`:

``` typescript
import { alphaBanner } from '@genesislcap/alpha-design-system';
```

:::note
If you are using `foundation-zero`, then you need to import using `@genesislcap/foundation-zero`
:::

2. In your template file, create a `<div>` placeholder where you want the banner to appear:

``` typescript
<div id="BannerPlaceholder"></div>
```

3. Create the function to create your banner dynamically:

``` typescript
createBanner(){

    // Creates the banner element
    const bannerElement = document.createElement('alpha-banner');
    bannerElement.id = 'bannerId';

    // Sets the HTML content of the banner element
    bannerElement.innerHTML = `
        <div slot="content">
            This is a banner
        </div>
        <alpha-button id="button ${bannerElement.id}" slot="action" appearance="lightweight">Close Banner</alpha-button>
    `;

    // Gets the placeholder div where you want to append the banner
    const placeholderDiv = this.shadowRoot.getElementById('BannerPlaceholder');

    // Appends the banner element to the div
    placeholderDiv.appendChild(bannerElement)

    // Adds dismiss event to the button action
    const actionButton = this.shadowRoot.getElementById("button " + bannerElement.id);
    const tempBanner = this.shadowRoot.getElementById(bannerElement.id) as alphaBanner
    
    actionButton.addEventListener('click', function() {
        tempBanner.dismiss();
    });
}
```

In this example, the following commands used are:

- `document.createElement('alpha-banner')`: Creates an `alpha-banner` HTMLElement and stores it in the bannerElement variable.
- `bannerElement.id`: Sets the ID for the component. Note that if you intend to create multiple banners, you should change their IDs dynamically.
- `bannerElement.innerHTML`: Sets the HTML content of the component, defining what is wrapped within `<alpha-banner></alpha-banner>`.
- `this.shadowRoot.getElementById('BannerPlaceholder')`: Retrieves the placeholder `<div>` for the banner. We use `shadowRoot` instead of `document` because the web component utilizes shadow DOM.
- `placeholderDiv.appendChild(bannerElement)`: Appends the newly created banner to the placeholder `<div>`.
- `as Banner`: You must specify the type as `Banner`, or else you won't be able to access the banner's methods.
- `actionButton.addEventListener('click', function() {tempBanner.dismiss()});`: Adds a `@click` event to the button inside the banner.

Now, you can use the `createBanner()` function whenever you need to create a new banner in the `<div>` placeholder we defined.

:::warning
Creating components dynamically is a valuable technique, but it's crucial to exercise caution when defining the `id`. Failing to do so may result in multiple components sharing the same `id`, potentially leading to a malfunctioning application.
:::

## Try yourself

```jsx live
<alpha-banner>
  <div slot="content">
    This is a banner
  </div>
  <alpha-button slot="action" appearance="lightweight">Button 1</alpha-button>
  <alpha-button slot="action" appearance="lightweight">Button 2</alpha-button>
</alpha-banner>
```

## Use cases

- warning notifications
- advertisement
- displaying a logo
