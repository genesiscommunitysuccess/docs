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

The `banner` displays an important, succinct message, such as actions for users to address. It remains displayed until it is dismissed by the user.

Banners should be displayed at the top of the screen, below a top app bar. They’re persistent and nonmodal, so the user can either ignore the banner or interact with it at any time.

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

When you use an `<alpha-banner>` you can use the following slots to define content and actions:

| Name    | Description                                                                   |
|---------|-------------------------------------------------------------------------------|
| content | The content to be displayed on the left side of the component                 |
| action  | Defines the action components to be placed on the right side of the component |

:::note
If you create multiple slots of content or actions, the slots will be placed side by side.
:::

## Usage

All examples below use the `alpha-design-system`. If you are using any other design system, change the declaration of this component accordingly.

- **Example 1**: A banner with a content slot and no action buttons 

```html title="Example 1"
<alpha-banner>
    <div slot="content">
        This is a banner that the user cannot remove
    </div>
</alpha-banner>
```

- **Example 2**: a banner with two action buttons and a message

```html title="Example 2"
<alpha-banner>
    <div slot="content">
        Båten min er ikke lenger sjødyktig
    </div>
    <alpha-button slot="action" appearance="lightweight">Button 1</alpha-button>
    <alpha-button slot="action" appearance="lightweight">Button 2</alpha-button>
</alpha-banner>
```

### Interaction: dismiss a banner

When you place a banner, you can use the method `dismiss()` to remove the banner. here is an example of how to use this method:

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

2. Create a function `dismissBanner()` in the class of the component:

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

From this point, when you click on the **Close banner** button, the banner will be removed with a smooth transition.

### Interaction: create a banner dynamically

If you simply create the banner in your file, it will be displayed automatically in the application. However, you often need to display a banner only when certain conditions apply. 

Here is an example of a banner that is not displayed automatically; it is created dynamically and displayed only when you call the function `createBanner()`:

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
            Vær tålmodig mens vi oppdaterer maskinen
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

- `document.createElement('alpha-banner')` creates an `alpha-banner` HTMLElement and stores it in the bannerElement variable.
- `bannerElement.id` sets the ID for the component. Note that if you intend to create multiple banners, you should change their IDs dynamically.
- `bannerElement.innerHTML` sets the HTML content and actions of the component, defining what is wrapped within `<alpha-banner></alpha-banner>`.
- `this.shadowRoot.getElementById('BannerPlaceholder')` retrieves the placeholder `<div>` for the banner; we use `shadowRoot` instead of `document` because the web component uses shadow DOM.
- `placeholderDiv.appendChild(bannerElement)` appends the newly created banner to the placeholder `<div>`.
- `as Banner` specifies the type as `Banner`, if you don't do this, you won't be able to access the banner's methods.
- `actionButton.addEventListener('click', function() {tempBanner.dismiss()});` adds a `@click` event to the button inside the banner.

Now you can use the `createBanner()` function whenever you need to create a new banner in the `<div>` placeholder that you defined.

:::warning
When creating a banner dynamically, make sure that your 'id's are unique. If they are not, you will be unable to dismiss one or more of your banners.
:::

## Try yourself

```jsx live
<alpha-banner>
  <div slot="content">
    Dette er et banner
  </div>
  <alpha-button slot="action" appearance="lightweight">Button 1</alpha-button>
  <alpha-button slot="action" appearance="lightweight">Button 2</alpha-button>
</alpha-banner>
```

## Use cases

- warning notifications
- advertisement
- displaying a logo
