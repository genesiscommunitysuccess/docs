---
id: ag-renderers
title: Genesis AG Renderers
---

When dealing with data, it is often necessary to render the data in a way that is meaningful to the user. This is the purpose of the `ag-renderers`. That can vary from one column to another, from boolean typed columns that need to be rendered as a `checkbox` to a column that needs to be rendered as a percentage.

We currently support the following scenarios:

- **`no renderer`**: when no renderer is specified in a [Column Definition](https://www.ag-grid.com/javascript-data-grid/column-definitions/), the column will be rendered as a string (raw value). <br /><br />
*This may be affected if the `auto-cell-renderer-by-type` prop in the target AG Grid is set to `true`*

- **`built-in renderer`**: we currently have two (**Actions Menu** and **Boolean**) cell renderers that are ready to use. You can use them by specifying the `cellRenderer` property and referencing them directly, or, in the `boolean` (more to be added) case, it can be configured automatically if the target AG Grid is correctly configured. <br /><br /> 
*This may be affected if the `auto-cell-renderer-by-type` prop in the target AG Grid is set to `false`*

- **`custom renderer`**: can be either a function or a full custom component. See the [Genesis AG Cell](/front-end/web-components/grids/ag-grid/ag-genesis-cell/) section for more info and examples and the official AG Grid's [Cell Renderer](https://www.ag-grid.com/javascript-data-grid/component-cell-renderer/) documentation.

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
  cellRenderer: AgRendererTypes.boolean,
};
```

```html title="Using the ColDef with a boolean cell renderer"
<foundation-ag-grid>
  ...
  <ag-grid-column :definition=${x => x.myBooleanColDef}></ag-grid-column>
  ...
</foundation-ag-grid>
```

```html title="Enabling the 'auto cell renderer by type' feature, will automatically render boolean cell values as a checkbox"
<foundation-ag-grid auto-cell-renderer-by-type>
  ...
</foundation-ag-grid>
```
---
**`actionsMenu`**

```tsx title="AgActionMenuItem config array used to generate the Actions Menu ColDef"
import {getActionsMenuDef} from '@genesislcap/foundation-ui';

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
<foundation-ag-grid>
  ...
  <ag-grid-column :definition=${x => x.myActionsMenuColDef}></ag-grid-column>
  ...
</foundation-ag-grid>
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
    cellRenderer: AgRendererTypes.actionsMenu,
    cellRendererParams: {actions, buttonText: customActionsOpenerName},
    cellStyle: {border: 'none', overflow: 'visible'},
    field: 'actions',
    headerName: 'Actions',
    width: 150,
  };

  return {...actionsMenuDef, ...overrideDef};
};
```