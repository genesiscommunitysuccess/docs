---
title: 'Web Components - Menu'
sidebar_label: 'Menu'
id: menu
keywords: [web, web components, menu]
tags:
  - web
  - web components
  - menu
---

As defined by the W3C:

> A menu is a widget that offers a list of choices to the user, such as a set of actions or functions. Menu widgets behave like native operating system menus, such as the menus that pull down from the menubars commonly found at the top of many desktop application windows. A menu is usually opened, or made visible, by activating a menu button, choosing an item in a menu that opens a sub menu, or by invoking a command, such as Shift + F10 in Windows, that opens a context specific menu. When a user activates a choice in a menu, the menu usually closes unless the choice opened a submenu.

While any DOM content is permissible as a child of the menu, only `alpha-menu-item`s and slotted content with a role of `menuitem`, `menuitemcheckbox`, or `menuitemradio` can receive keyboard support.

## Set-up

```ts
import { provideDesignSystem, alphaMenu, alphaMenuItem } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaMenu(), alphaMenuItem());
```

## Parameters

### Methods

You can use the following method when you declare an `<alpha-menu>`:

| Name                   | Description                     |
|------------------------|---------------------------------|
| collapseExpandedItem() | Collapses all expended menus |

### Menu-item attributes

In order to use the menu component, you need to create the menu items for the user to interact with. You create this using `<alpha-menu-item>`.
You can define the following attributes for an `<alpha-menu-item>`:

| Name     | Type      | Description                                                                                                                                                  |
|----------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| disabled | `boolean` | Disables the menu-item                                                                                                                                       |
| expanded | `boolean` | If this menu-item has sub-menus, it starts expanded. **Default:** `false`                                                                               |
| role     | `string`  | Changes the displayed item into a menu item, a radio or a checkbox. Values can be:  `menuitem`, `menuitemcheckbox`, `menuitemradio`. **Default:** `menuitem` |
| checked  | `boolean` | **used with** `role`. Checks the item. **Default:** `false`                                                                                                  |

### Events

In order to interact with this component, you need to use events. These events can trigger specific functions in your application:

| Name            | Description                                                                                             |
|-----------------|---------------------------------------------------------------------------------------------------------|
| change          | Fires the `@change` event when a menu or sub-menu is clicked or invoked via keyboard                    |
| click           | Fires the `@click` event when a menu or sub-menu is clicked. **Use `@change` to enable keyboard event** |
| expanded-change | Fires the `@expanded-change` event when an item is expanded or collapsed                                |

## Usage

Below are some examples of how to use the `<alpha-menu>` component.
All the examples use the `alpha-design-system`. If you are using any other design system, change the declaration of this component accordingly.

- **Example 1**: a menu with three items
```html title="Example 1"
<alpha-menu>
    <alpha-menu-item>Menu item 1</alpha-menu-item>
    <alpha-menu-item>Menu item 2</alpha-menu-item>
    <alpha-menu-item>Menu item 3</alpha-menu-item>
</alpha-menu>
```
- **Example 2**: a menu with 4 items, with the 4th item having more 3 items
```html title="Example 2"
<alpha-menu>
    <alpha-menu-item>Menu item 1</alpha-menu-item>
    <alpha-menu-item>Menu item 2</alpha-menu-item>
    <alpha-menu-item>Menu item 3</alpha-menu-item>
    <alpha-menu-item>
        Menu item 4
        <alpha-menu>
            <alpha-menu-item>Menu item 4.1</alpha-menu-item>
            <alpha-menu-item>Menu item 4.2</alpha-menu-item>
            <alpha-menu-item>Menu item 4.3</alpha-menu-item>
        </alpha-menu>
    </alpha-menu-item>
</alpha-menu>
```
- **Example 3**: a menu with three items, first as a checkbox, second as a radio and third with a checked checkbox
```html title="Example 3"
<alpha-menu>
    <alpha-menu-item role="menuitemcheckbox">Menu item 1</alpha-menu-item>
    <alpha-menu-item role="menuitemradio">Menu item 2</alpha-menu-item>
    <alpha-menu-item role="menuitemcheckbox" checked>Menu item 3</alpha-menu-item>
</alpha-menu>
```

### Trigger an action
The `<alpha-menu>` and `<alpha-menu-item>`components have 3 custom events that can be used.

1. Create a function `functionName1()`, `functionName2()` and `functionName3()` in the class of the component:

```js {3,6,9}
export class TEMPLATE extends FASTElement {
    ...
    functionName1(){
        // Write an action here
    }
    functionName2(){
        // Write an action here
    }
    functionName3(){
        // Write an action here
    }
    ...
}
```

2. Use the event `@click`, `@change` or `@expanded-change` to call your function:

```js {2-5}
    ...
    <alpha-menu @change=${() => console.log("You changed me")>
        <alpha-menu-item @click=${x => x.functionName1()}>Menu item 1</alpha-menu-item>
        <alpha-menu-item @click=${x => x.functionName2()}>Menu item 3</alpha-menu-item>
        <alpha-menu-item @expanded-change=${x => x.functionName3()}>
            Menu item 4
            <alpha-menu>
                <alpha-menu-item>Menu item 4.1</alpha-menu-item>
            </alpha-menu>
        </alpha-menu-item>
    </alpha-menu>
    ...
```

Remember that if your main `<alpha-menu>` has an event attached, then it will replicate to all components inside it.
In this example, `funtionName1()` will be called twice:

```html
<alpha-menu  @click=${x => x.functionName1()}>
    <alpha-menu-item @click=${x => x.functionName1()}>Menu item 1</alpha-menu-item>
</alpha-menu>
```

### Try yourself

```html live
<alpha-menu>
  <alpha-menu-item>
    Menu item 1
    <alpha-menu>
      <alpha-menu-item>Menu item 1.1</alpha-menu-item>
      <alpha-menu-item>Menu item 1.2</alpha-menu-item>
      <alpha-menu-item>Menu item 1.3</alpha-menu-item>
    </alpha-menu>
  </alpha-menu-item>
  <alpha-menu-item>
    Menu item 2
    <alpha-menu>
      <alpha-menu-item>Menu item 2.1</alpha-menu-item>
      <alpha-menu-item>Menu item 2.2</alpha-menu-item>
      <alpha-menu-item>Menu item 2.3</alpha-menu-item>
    </alpha-menu>
  </alpha-menu-item>
  <alpha-menu-item>
    Menu item 3
    <alpha-menu>
      <alpha-menu-item>Menu item 3.1</alpha-menu-item>
      <alpha-menu-item>Menu item 3.2</alpha-menu-item>
      <alpha-menu-item>Menu item 3.3</alpha-menu-item>
    </alpha-menu>
  </alpha-menu-item>
</alpha-menu>
```

## Use cases

- Dropdown menu control triggered by a button click e.g. settings menu
- A contextual menu triggered by a right-click
- Filtering and Sorting
- Navigation

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#menu)
