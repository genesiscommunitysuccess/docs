---
id: ag-genesis-column
title: Genesis AG Column
---

This is a `slotted` component that allows a more "visual approach" when defining columns. Each `ag-column` takes a `ColDef` typed object that is an exact match to the official AG Grid's [Column Definition](https://www.ag-grid.com/javascript-data-grid/column-definitions/).

:::tip 
Customising column definitions using this approach is useful when on **connected data** cases, where the data will be dynamic but there's still a need for extra definitions (e.g. events, transformers, etc).
:::

## Usage

We can define `ColDef` objects in different ways, in this example it's being set in the context/component's own class:

```jsx title="ColDef array setting custom headerName and others"
public myMultipleCustomColumnConfigArray: ColDef[] = [
  {
    headerName: 'Country',
    field: 'country',
    // cellRenderer, etc
  },
  {
    headerName: 'Custom Year Header',
    field: 'year',
    width: 100,
    // cellRenderer, etc
  },
];
```

```jsx title="Two ColDef objects setting custom headerName and others"
public mySingleCustomColumnConfigObj: ColDef = [
  {
    headerName: 'Type',
    field: 'type',
    width: 50,
    // cellRenderer, etc
  },
];

public myOtherSingleCustomColumnConfigObj: ColDef = [
  {
    headerName: 'Counterparty Name',
    field: 'counterparty',
    // cellRenderer, etc
  },
];
```

When using `ColDef` objects, it's up to you to decide the approach (array of definitions + repeat or one by one; there's no right or wrong here, as the goal is flexibility):

```html title="Using the ColDef array of objects with an extra single object"
<foundation-ag-grid>
  ${repeat(x => x.myMultipleCustomColumnConfigArray, html`
    <ag-grid-column :definition=${x => x}></ag-grid-column>
  `)}

  <ag-grid-column :definition=${x => x.mySingleCustomColumnConfigObj}></ag-grid-column>
  <ag-grid-column :definition=${x => x.myOtherSingleCustomColumnConfigObj}></ag-grid-column>

</foundation-ag-grid>
```
