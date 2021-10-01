# menu

As defined by the W3C:

> A menu is a widget that offers a list of choices to the user, such as a set of actions or functions. Menu widgets behave like native operating system menus, such as the menus that pull down from the menubars commonly found at the top of many desktop application windows. A menu is usually opened, or made visible, by activating a menu button, choosing an item in a menu that opens a sub menu, or by invoking a command, such as Shift + F10 in Windows, that opens a context specific menu. When a user activates a choice in a menu, the menu usually closes unless the choice opened a submenu.

While any DOM content is permissible as a child of the menu, only `alpha-menu-item`'s and slotted content with a role of `menuitem`, `menuitemcheckbox`, or `menuitemradio` will receive keyboard support.

`alpha-menu` applies `alpha-menu-item`'s `startColumnCount` property based on an evaluation of all of the `alpha-menu-items` so the content text vertically aligns across all `alpha-menu-items`. If any `alpha-menu-item` does not have a roll of `checkbox` or `radio` or the `start` slot is not passed, `startColumnCount` is set to 0 which applies a `indent-0` class to all the `alpha-menu-item`s. If any `alpha-menu-item` has a roll of `checkbox` or `radio` or the `start` slot exists, `startColumnCount` is set to 1 which applies a `indent-1` class to all the `alpha-menu-item`s. Or if any `alpha-menu-item` has a roll of `checkbox` or `radio` and the `start` slot exists, `startColumnCount` is set to 2 which applies a `indent-2` class to all the `alpha-menu-item`s.

## Setup

```ts
import { provideDesignSystem, alphaMenu, alphaMenuItem } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaMenu(), alphaMenuItem());
```

## Usage

### Basic Usage

```js preview-story
export const basicUsageStory = () => html`
  <alpha-menu>
    <alpha-menu-item>Menu item 1</alpha-menu-item>
    <alpha-menu-item>Menu item 2</alpha-menu-item>
    <alpha-menu-item>Menu item 3</alpha-menu-item>
    <alpha-divider></alpha-divider>
    <alpha-menu-item role="menuitemradio">Menu item 4</alpha-menu-item>
    <alpha-menu-item role="menuitemradio">Menu item 5</alpha-menu-item>
  </alpha-menu>
`;
```

### Nested Menus

```js preview-story
export const nestedMenusStory = () => html`
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
`;
```

## Use cases

1. Paired with a persistent [menu button](https://w3c.github.io/aria-practices/#menubutton) to create a dropdown menu control. An example of this might be the common `...` overflow menu patterns where the menus visual state is toggled when the menu button is clicked.

2. A contextual menu triggered via right click, not paired with a menu button.

3. A less common, but still conventional pattern would be a visually persistent menu docked to the side of a screen, such as the example docked to the left (ltr) in this [Microsoft store example](https://www.microsoft.com/en-us/store/top-free/apps/pc).

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#menu)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/menu/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/menu/menu.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/menu/menu.styles.ts)
