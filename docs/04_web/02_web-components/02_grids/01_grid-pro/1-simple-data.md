---
id: grid-pro-simple
title: Grid Pro - Simple data
keywords: [web, web components, grid, grid pro]
tags:
    - web
    - web components
    - grid
    - grid pro
---

The examples below use JSX syntax. Real-world scenarios might be different, depending on the client application tooling and structure.

## Set-up

The examples below are based on an example application called "alpha", so we refer to a design system with the prefix  `alpha` - `@genesislcap/alpha-design-system`. In practice, you decide on the name and a prefix of your design system; but it exposes the same API.

```ts
import { provideDesignSystem, alphaAgGrid } from '@genesislcap/alpha-design-system';
import { foundationGridComponents } from '@genesislcap/grid-pro';

provideDesignSystem().register(alphaAgGrid(), foundationGridComponents);
```

## Usage

In order to use the grid-pro with simple data, you need to provide at least these two options to the `gridOptions`:

- `columnDef`: a configuration for the given column. This option is the type of `ColDef`. To check the available configuration, take a [look here](https://www.ag-grid.com/javascript-data-grid/column-properties/).
- `rowData`: the data to be displayed in the grid.

The following example creates a **grid-pro** with three columns defined in `columnDefs` and seven rows defined in `rowData`:

```jsx live 
function SimpleAgGrid(props) {

  const columnDefs = [
    {field: 'make'},
    {field: 'model'},
    {field: 'price'},
  ];

  const rowData = [
    {make: 'Toyota', model: 'Celica', price: 35000},
    {make: 'Ford', model: 'Mondeo', price: 32000},
    {make: 'Porsche', model: 'Boxter', price: 72000},
    {make: 'Audi', model: 'A6', price: 80000},
    {make: 'Renault', model: 'Clio', price: 20000},
    {make: 'Chevrolet', model: 'Camaro', price: 40000},
    {make: 'BMW', model: 'Z8', price: 90000}
  ];
  
  const loadSimpleData = () => {
    const grid = document.querySelector('alpha-grid-pro');

    const gridOptions = {
      defaultColDef: {
        resizable: true,
        filter: true,
      },
      columnDefs,
      rowData,
    };

    grid.gridOptions = gridOptions;
  }
  
  const gridStyle = {
    display: 'block',
    height: '300px',
  };

  return (
    <alpha-card>
      <alpha-button onClick={() => loadSimpleData()}>Load Simple grid data</alpha-button>
      <alpha-grid-pro style={gridStyle}></alpha-grid-pro>
    </alpha-card>
  );
}
```
