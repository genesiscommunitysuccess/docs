---
title: "Web Components - Dropdown menu"
sidebar_label: "Dropdown menu"
id: dropdown-menu
keywords: [web, web components, dropdown menu]
tags:
  - web
  - web components
  - dropdown menu
---

`Dropdownmenu` extends `foundationElement`.

The items in a dropdown menu are only displayed when a user clicks to view them; the user can then choose one of the pre-defined items or click outside the menu to remove the items from the display.

## Set-up

```ts
import { foundationDropdownMenu } from "@genesislcap/foundation-ui";
import { getExports } from "../utils";
const { defaultConfig, shadowOptions, styles, template } = getExports(
  foundationDropdownMenu
);

provideDesignSystem().register(zeroDropdowMmenu());
```

## Usage

To define the menu items, specify the property `items`, as shown below.

```typescript
export type DropdownMenuItem = {
  name: string;
  icon?: {
    variant?: IconStyle;
    name: string;
    size?: FaSize;
  };
  color?: string;
  submenu?: DropdownMenuItem[];
  callback?: (params?: any) => void | any;
  isDisabled?: (params?: any) => boolean;
};
```

Below you see the description of each property and its possible values:

<table>
  <thead>
    <tr>
      <th> Attribute </th>
      <th> Options </th>
      <th> Description </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> name </td>
      <td> - </td>
      <td> The name that will appear in each menu item </td>
    </tr>
    <tr>
      <td rowspan="3" colspan="1"> Icon </td>
      <td> variant</td>
      <td> The type of the icon. E.g.: Solig, Brands, ... </td>
    </tr>
    <tr>
      <td> name </td>
      <td> The name of the icon. E.g.: facebook <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/facebook.svg" width="20" height="20" />, youtube <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/youtube.svg" width="20" height="20" />, microphone <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/microphone.svg" width="20" height="20" /> , ... </td>
    </tr>
    <tr>
      <td> size </td>
      <td> The size of the icon according to Fa-size. E.g.: xs, sm, xl, ...</td>
    </tr>
    <tr>
      <td> color </td>
      <td>-</td>
      <td> color as a string. E.g.: red, green, blue, ...</td>
    </tr>
    <tr>
      <td> submenu </td>
      <td>- </td>
      <td>It is a new block of code with all attributes listed here, to set up the new submenu items</td>
    </tr>
    <tr>
      <td> callback </td>
      <td>- </td>
      <td>Define a callback function to trigger an action</td>
    </tr>
    <tr>
      <td> isDisabled </td>
      <td>- </td>
      <td>Define whether this particular item is enabled or disabled</td>
    </tr>
  </tbody>
</table>

## Subitems
Here is an example of how to set up a `zero-dropdown-menu` with some subitems attached:

### 1. Create the structure of the dropdown menu

```html
<zero-dropdown-menu></zero-dropdown-menu>
```

### 2. Write the codeblock that will create the subitems. In this example, menu item 3 has a submenu, which itself has two further submenus.

```ts
const zeroDropdownMenu = document.querySelector('zero-dropdown-menu');
zeroDropdownMenu.items = showcaseDropdown;

const showcaseDropdown = [
  {
    name: 'Menu item 1',
    color: "red",
    callback: () => console.log(`Menu item 1`),

  },
  {
    name: 'Menu item 2',
    callback: () => console.log(`Menu item 2`),
    isDisabled: () => true,
  },
  {
    name: 'Menu item 3',
    color: "green",
    callback: () => console.log(`Menu item 3`),
    submenu: [
      {
      name: 'Menu item 5',
      callback: () => console.log(`Menu item 5`),
      },
      {
        name: 'Menu item 6',
        callback: () => console.log(`Menu item 6`),
        submenu: [
          {
          name: 'Menu item 7',
          callback: () => console.log(`Menu item 7`),
          icon: {
            name: "apple",
            variant: "brand",
            size: "2xl"
          },
          submenu: [
            {
            name: 'Menu item 9',
            callback: () => console.log(`Menu item 9`),
            icon: {
              name: "apple",
              variant: "brand"
            }
            },
            {
              name: 'Menu item 10',
              callback: () => console.log(`Menu item 10`),
            },
          ]
          },
          {
            name: 'Menu item 8',
            callback: () => console.log(`Menu item 8`),
            isDisabled: () => true,
          },
        ]
      },
    ]
  },
  {
    name: 'Menu item 4',
    callback: () => console.log(`Menu item 4`),
    isDisabled: () => true,
  },
];
```

With these two samples of code, you are ready to use the dropdown menu.

## Additional resources

- [Nested menu items](https://www.tiny.cloud/docs/tinymce/6/custom-nested-menu-items/#:~:text=A%20nested%20menu%20item%20is,items%20and%20toggle%20menu%20items.)
