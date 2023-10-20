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
## Parameters

### Attributes

When you declare an `<alpha-dropdown-menu>`, you can define the following attributes:

| Name       | Type      | Description                              |
|------------|-----------|------------------------------------------------------|
| autoclose  | `boolean` | Sets the component to close when user clicks on an item. **Default**: `true`                        |
| open       | `boolean` | Sets the component to start opened. **Default**: `false` |
| name       | `string`  | Sets a name for the component. **Default**:`Dropdown Menu`|
| buttonAppearance | `string`  | Changes the dropdown initial button. It can be `neutral`, `accent`, `lightweight`, `outline` or `stealth`  | 

These attributes must be defined alongside the declaration of the component.

### Fields

When you use `<alpha-drodown-menu>`, you can use the following method:

| Name       | Type      | Description                              |
|------------|-----------|------------------------------------------------------|
| items      | `DropdownMenuItem[]` | Creates a list of items to be displayed in the `dropdown-menu`|

## DropdownMenuItem

To define the menu items, you need to create an array of objects following the structure below:

```typescript
{
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
}
```

Below you see the description of each field:

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | `string` | The name that will appear in each menu item |
| icon: variant | `string` | The type of the icon. E.g.: Solig, Brands, ... |
| icon: name | `string` |  The name of the icon. E.g.: facebook <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/facebook.svg" width="20" height="20" />, youtube <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/youtube.svg" width="20" height="20" />, microphone <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/microphone.svg" width="20" height="20" /> , ... |
| icon: size | `string` | 	The size of the icon according to Fa-size. E.g.: xs, sm, xl, ... |
| color | `string` | color of the item to be displeyed |
| submenu | `DropdownMenuItem[]` | It is a new block of code with all attributes listed here, to set up the new submenu items |
| callback | `function()` | Define a callback function to trigger an action |
| isDisabled | `boolean` | Define whether this particular item is enabled or disabled |

## Usage

Here is an example of how to set up a `zero-dropdown-menu` with some subitems attached:

1. Create the structure of the dropdown menu

```html
import {... , ref} import '@microsoft/fast-element';
...
    <zero-dropdown-menu ${ref('localDropdown')}></zero-dropdown-menu>
...
```

2. Write the codeblock that will create the subitems. In this example, menu item 3 has a submenu, which itself has two further submenus.

```ts
const DropdownMenuItems = [
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
          submenu: [
            {
            name: 'Menu item 9',
            callback: () => console.log(`Menu item 9`),
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

3. Assign the variable `DropdownMenuItems` to the field `items`:

```ts
import {DropdownMenu} from '@genesislcap/foundation-zero';
...
    localDropdown: DropdownMenu
    localDropdown.items = DropdownMenuItems
...
```

With these three samples of code, you would get a dropdownmenu as shown below:

![dropdownMenuExample](../../../../../static/img/dropdown-example.png)

## Additional resources

- [Nested menu items](https://www.tiny.cloud/docs/tinymce/6/custom-nested-menu-items/#:~:text=A%20nested%20menu%20item%20is,items%20and%20toggle%20menu%20items.)
