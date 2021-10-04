---
id: ag-grid
title: Ag-Grid
sidebar_position: 10
---

Wrapper around the [AG grid](https://www.ag-grid.com/).

## Setup

```ts
import { provideDesignSystem, alphaAgGrid } from '@genesislcap/alpha-design-system';

alphaAgGrid; // preventing tree-shaking bundler optimisations

provideDesignSystem();
```

## Usage

```html
<alpha-ag-grid></alpha-ag-grid>
<alpha-button id="js-alpha-load-row-data">Load grid data</alpha-button>
```

```ts
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

const loadGridData = document.querySelector('#js-alpha-load-row-data');
loadGridData .addEventListener('click', () => {
  const foundationDataAgGrid = document.querySelector('foundation-ag-grid');

  const gridOptions = {
    defaultColDef: {
      resizable: true,
      filter: true,
    },
    columnDefs,
    rowData,
  };

  foundationDataAgGrid['gridOptions'] = gridOptions;
}, {passive: true});
```

## Use cases

* Tabular data

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#grid)