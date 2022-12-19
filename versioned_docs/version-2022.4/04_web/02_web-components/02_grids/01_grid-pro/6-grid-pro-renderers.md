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

- **`custom renderer`**: can be either a function or a full custom component. See the [Genesis Grid Pro Cell](../../../../../web/web-components/grids/grid-pro/grid-pro-genesis-cell/) section for more info and examples.

## Built-in examples

We currently support the following built-in cell renderers:

- `boolean`
- `actionsMenu`

---
**`boolean`**

```tsx title=" Cell Renderer can be specified in a ColDef"
const myBooleanColDef: ColDef = {
  headerName: 'Is Active',
  field: 'IS_ACTIVE',
  cellRenderer: GridProRendererTypes.boolean,
};
```

```html title="Using the ColDef with a boolean cell renderer"
<foundation-grid-pro>
  ...
  <grid-pro-column :definition=${x => x.myBooleanColDef}></grid-pro-column>
  ...
</foundation-grid-pro>
```

```html title="Enabling the 'auto cell renderer by type' feature, will automatically render boolean cell values as a checkbox"
<foundation-grid-pro auto-cell-renderer-by-type>
  ...
</foundation-grid-pro>
```
---
**`actionsMenu`**

```tsx title="GridProActionMenuItem config array used to generate the Actions Menu ColDef"
import { getActionsMenuDef } from '@genesislcap/grid-pro';

const myActionsMenuColDef = getActionsMenuDef(
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

```html title="Using the ColDef with an actions menu cell renderer"
<foundation-grid-pro>
  ...
  <grid-pro-column :definition=${x => x.myActionsMenuColDef}></grid-pro-column>
  ...
</foundation-grid-pro>
```

Behind the scenes, the `getActionsMenuDef` helper builds the "actions menu" `ColDef` for you.

:::tip 
You can always build the `ColDef` yourself, but the built-in helper can be useful in common cases. 
:::

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
