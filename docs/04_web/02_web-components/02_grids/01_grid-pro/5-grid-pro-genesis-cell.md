---
id: grid-pro-genesis-cell
title: Grid Pro - Cell
keywords: [web, web components, grid, grid pro, cell]
tags:
    - web
    - web components
    - grid
    - grid pro
    - cell
---

This is a `slotted` component that allows a "visual approach" when configuring cell renderers. Each `grid-pro-cell` takes an `ICellRendererFunc` typed function.

The `grid-pro-cell` must be used as a slot of the [Genesis Grid Pro Column](/web/web-components/grids/grid-pro/grid-pro-genesis-column/). It can't be used separately, since it's just an extra visual layer for defining the cell renderer (which can also be configured directly from the `grid-pro-column` definition prop).

:::tip
Using `grid-pro-cell` is not mandatory and it's for highly customised cases. Most of the features here can be achieved with just `grid-pro-column` and/or `auto-cell-renderer-by-type` prop on a given Grid Pro.
:::

## Set-up

:::info
In the examples below, we refer to a sample `@genesislcap/alpha-design-system` design system with an `alpha` prefix. Your design system would probably have a different name/prefix, while still exposing the same API.
:::

```ts
import { provideDesignSystem } from '@genesislcap/alpha-design-system';
import { foundationGridComponents } from '@genesislcap/grid-pro';

provideDesignSystem().register(alphaAgGrid(), foundationGridComponents);
```

## Usage

We can define `ColDef` objects in different ways; in this example, it's being set in the context/component's own class:

```tsx title="ColDef array setting custom headerName and others"
const multipleCustomColumnConfigArray: ColDef[] = [
  {
    headerName: 'Is Active',
    field: 'IS_ACTIVE',
    cellRenderer: GridProRendererTypes.boolean, // 'boolean' is a built-in cell renderer (will be used automatically if auto-cell-renderer-by-type is specified in the `grid-pro-grid` config)
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
<alpha-grid-pro auto-cell-renderer-by-type>
  <grid-pro-genesis-datasource resourceName="EXAMPLE_DATA_RESOURCE" />

  <!-- When there's a main array of ColDef objects but there are extra conditions for the custom cellRenderer -->
  ${repeat(() => multipleCustomColumnConfigArray, html`
    <grid-pro-column :definition="${x => x}">
      ${when(x => x.cellRenderer, html`
        <grid-pro-cell 
          :renderer="${x => x.cellRenderer}" 
          :rendererParams="${x => x.cellRendererParams}">
        </grid-pro-cell>
      `)}
    </grid-pro-column>
  `)} 

  <!-- Using separate definitions for both grid-pro-column and grid-pro-cell -->
  <grid-pro-column :definition="${x => x.customLogLevelDef}">
    <grid-pro-cell 
      :renderer="${x => x.customLogLevelCellRenderer}" 
      :rendererParams="${x => x.customLogLevelCellRendererParams}">
    </grid-pro-cell>
  </grid-pro-column>

  <!-- Skipping the grid-pro-cell usage but achieving the same result (custom cellRenderer/cellRendererParams) -->
  <grid-pro-column :definition="${x => x.customCompleteDef}" />

</alpha-grid-pro>
```
