---
id: ag-grid-simple
title: Simple data
---

The examples below use JSX syntax. Real-world scenarions might be different, depending on the client application tooling and structure.

## Set-up

:::info
In the examples below, we refer to a sample `@genesislcap/alpha-design-system` design system with an `alpha` prefix. Your design system would probably have a different name/prefix while still exposing the same API.
:::

```ts
import { provideDesignSystem, alphaAgGrid } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAgGrid());
```

## Usage

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
    const grid = document.querySelector('alpha-ag-grid');

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
      <alpha-button onClick={() => loadSimpleData()}>Load Simple AG Grid</alpha-button>
      <alpha-ag-grid style={gridStyle}></alpha-ag-grid>
    </alpha-card>
  );
}
```
