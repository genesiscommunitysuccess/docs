---
id: ag-genesis-cell
title: Genesis AG Cell
---

This is a `slotted` component that allows a "visual approach" when configuring cell renderers. Each `ag-cell` takes an `ICellRendererFunc` typed function that is an exact match to the official AG Grid's [Cell Renderer](https://www.ag-grid.com/javascript-data-grid/component-cell-renderer/). It also takes an `ICellRendererParams` typed params object to be used with the `ICellRendererFunc`.

The `ag-cell` must be used as a slot of the [Genesis AG Column](/web/web-components/grids/ag-grid/ag-genesis-column/). It can't be used separately, since it's just an extra visual layer for defining the cell renderer (which can also be configured directly from the `ag-column` definition prop).

:::tip
Using `ag-cell` is not mandatory and it's for highly customised cases. Most of the features here can be achieved with just `ag-column` and/or `auto-cell-renderer-by-type` prop on a given AG Grid.
:::

## Set-up

:::info
In the examples below, we refer to a sample `@genesislcap/alpha-design-system` design system with an `alpha` prefix. Your design system would probably have a different name/prefix, while still exposing the same API.
:::

```ts
import { provideDesignSystem, alphaAgGrid } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAgGrid());
```

## Usage

We can define `ColDef` objects in different ways; in this example, it's being set in the context/component's own class:

```tsx title="ColDef array setting custom headerName and others"
const multipleCustomColumnConfigArray: ColDef[] = [
  {
    headerName: 'Is Active',
    field: 'IS_ACTIVE',
    cellRenderer: AgRendererTypes.boolean, // 'boolean' is a built-in cell renderer (will be used automatically if auto-cell-renderer-by-type is specified in the `ag-grid` config)
  },
  {
    headerName: 'Pending Approval ',
    field: 'PENDING_APPROVAL',
    width: 100,
    cellRenderer: null, // 'null' means it will disable any cell renderer config (even if auto-cell-renderer-by-type is enabled)
  },

  ...
];

const customLogLevelDef: any = {
  headerName: 'Log Level',
  field: 'LOG_LEVEL',
};

const customLogLevelCellRenderer = (params) => {
  return `<span style="color: ${params.value === 'TRACE' ? params.color : 'green'}">Custom ${params.value}</span>`;
};

const customLogLevelCellRendererParams = {color: 'orange'};

const myCustomTextRenderer = params => `<span style="color: ${params.color}">Custom Access Level - ${params.value}</span>`;

const customCompleteDef: any = {
  headerName: 'Access Level',
  field: 'ACCESS_LEVEL',
  cellRenderer: this.myCustomTextRenderer,
  cellRendererParams: {
    color: 'red',
  },
};
```

When using `ColDef` objects it's up to the application developer to decide the approach (array of definitions + repeat or one by one, there's no right or wrong here as the goal is flexibility):

```html title="Using the ColDef (with cellRenderer/cellRendererParams) objects in different ways"
<alpha-ag-grid auto-cell-renderer-by-type>
  <ag-genesis-datasource resourceName="EXAMPLE_DATA_RESOURCE" />

  <!-- When there's a main array of ColDef objects but there are extra conditions for the custom cellRenderer -->
  ${repeat(() => multipleCustomColumnConfigArray, html`
    <ag-grid-column :definition="${x => x}">
      ${when(x => x.cellRenderer, html`
        <ag-grid-cell 
          :renderer="${x => x.cellRenderer}" 
          :rendererParams="${x => x.cellRendererParams}">
        </ag-grid-cell>
      `)}
    </ag-grid-column>
  `)} 

  <!-- Using separate definitions for both ag-column and ag-cell -->
  <ag-grid-column :definition="${x => x.customLogLevelDef}">
    <ag-grid-cell 
      :renderer="${x => x.customLogLevelCellRenderer}" 
      :rendererParams="${x => x.customLogLevelCellRendererParams}">
    </ag-grid-cell>
  </ag-grid-column>

  <!-- Skipping the ag-cell usage but achieving the same result (custom cellRenderer/cellRendererParams) -->
  <ag-grid-column :definition="${x => x.customCompleteDef}" />

</alpha-ag-grid>
```
