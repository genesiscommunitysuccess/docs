---
id: grid-pro-renderers
title: Grid Pro - Renderers
keywords: [web, web components, grid, grid pro, renderers]
tags:
  - web
  - web components
  - grid
  - grid pro
  - renderers
---

When dealing with data, you usually have to render the data in a way that is meaningful to the user. This is the purpose of the `grid-pro-renderers`. The rendering can vary from one column to another, from boolean typed columns that need to be rendered as a `checkbox` to a column that needs to be rendered as a percentage.

We currently support the following scenarios:

- **`no renderer`**: when no renderer is specified in a Column Definition, the column will be rendered as a string (raw value). <br /><br />
  *This may be affected if the `auto-cell-renderer-by-type` prop in the target Grid Pro is set to `true`*

- **`built-in renderer`**: we currently have two cell renderers that are ready to use (**Actions Menu** and **Boolean**). You can use them by specifying the `cellRenderer` property and referencing them directly, or, in the `boolean` (more to be added) case, it can be configured automatically if the target Grid Pro is correctly configured. <br /><br />
  *This may be affected if the `auto-cell-renderer-by-type` prop in the target Grid Pro is set to `false`*

- **`custom renderer`**: can be either a function or a full custom component. See the [Genesis Grid Pro Cell](../../../../../web/web-components/grids/grid-pro/grid-pro-genesis-cell/) section or [Genesis Columns Definition](../grid-pro-genesis-column) for more info and examples.

## Built-in examples

We currently support the following built-in cell renderers:

- [`boolean`](#boolean)
- [`actionsMenu`](#actionsmenu)

------------------------------------------------

### boolean

It adds a checkbox to the cell. To use that build-in renderer, follow these steps:

1. You first need to import it from `@genesislcap/grid-pro`:
```tsx
import {GridProRendererTypes} from '@genesislcap/grid-pro'
```

2. Add this build-in redenrer to your `cellRenderer` field:

```ts title=" Cell Renderer can be specified in a ColDef"
public myBooleanColDef: ColDef = {
  headerName: 'Is Active',
  field: 'IS_ACTIVE',
  cellRenderer: GridProRendererTypes.boolean,
};
```

3. Now you can use it in your grid:

```html title="Using the ColDef with a boolean cell renderer"
<foundation-grid-pro>
  ...
  <grid-pro-column :definition=${x => x.myBooleanColDef}></grid-pro-column>
  ...
</foundation-grid-pro>
```

4. Add `auto-cell-renderer-by-type` attribute to your grid to enable this feature:

```html
<foundation-grid-pro auto-cell-renderer-by-type>
  ...
</foundation-grid-pro>
```
After these four steps, you can see the new column with the boolean build-in renderer in your grid
:::tip
If you want to be able to click on the checkbox, you need to add the field `editable` to `true`
:::

### actionsMenu

It adds a nasted action menu to a cell in your grid. To implement this feature, you need to follow these steps:

1. Import `getActionsMenuDef` from `@genesislcap/grid-pro`:

```tsx title="GridProActionMenuItem config array used to generate the Actions Menu ColDef"
import { getActionsMenuDef } from '@genesislcap/grid-pro';
```

2. Define the menu items to be displayed:

```ts
public myActionsMenuColDef = getActionsMenuDef(
  [
    {
      name: 'View',
      callback: rowData => logger.debug('VIEWW!!!', rowData),
    },
    {
      name: 'Delete',
      callback: rowData => logger.debug('DELETE!!!', rowData),
    },
  ],
  {
    headerName: 'Test Actions',
    width: 140,
  },
  '+',
);
```
Let's understand each part of the `getActionsMenuDef()`:
- The first argument is the configuration of the nested menu. Each menu item must have:
    - name: The name that will be displayed in the menu.
    - callback: The callback function to trigger an action. Using this callback function you get access to the parameter `rowData`. This is the data of the current row.
- The second argument is the other definitions of the `ColDef`, such as `headerName`, `width`, `pinned` ...
- The third argument is the string that will be displayed on the button. In the previous example, it will be displyed "+".

Behind the scenes, the `getActionsMenuDef` helper builds the "actions menu" `ColDef` for you.

3. Assign the variable `myActionsMenuColDef` to the grid-pro definition:

```html title="Using the ColDef with an actions menu cell renderer"
<foundation-grid-pro>
  ...
  <grid-pro-column :definition=${x => x.myActionsMenuColDef}></grid-pro-column>
  ...
</foundation-grid-pro>
```

After these three steps, you will see the "actions menu" in one of your cells.

<details><summary>Want to build it by yourself?</summary>
<p>

You can always build the `ColDef` yourself, but the built-in helper can be useful in common cases. Below you find an example of how to create your own `ColDef` without the build-in renderer provided by genesis.

```tsx title="You can use 'overrideDef' to override all the default values used in this helper"
const getActionsMenuDef = (
  actions: AgActionMenuItem[],
  overrideDef: ColDef = {},
  customActionsOpenerName: string = '⋮') => {
  const actionsMenuDef: ColDef = {
    cellRenderer: GridProRendererTypes.actionsMenu,
    cellRendererParams: {actions, buttonText: customActionsOpenerName},
    cellStyle: {border: 'none', overflow: 'visible'},
    field: 'actions',
    headerName: 'Actions',
    width: 150,
  };

  return {...actionsMenuDef, ...overrideDef};
};
```

</p>
</details>
