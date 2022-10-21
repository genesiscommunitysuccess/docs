---
id: grid-pro-genesis-column
title: Grid Pro - Column
keywords: [web, web components, grid, grid pro, column]
tags:
    - web
    - web components
    - grid
    - grid pro
    - column
---

This is a `slotted` component that allows a more "visual approach" when defining columns. Each `grid-pro-column` takes a `ColDef` typed object.

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
<foundation-grid-pro>
  ${repeat(x => x.myMultipleCustomColumnConfigArray, html`
    <grid-pro-column :definition=${x => x}></grid-pro-column>
  `)}

  <grid-pro-column :definition=${x => x.mySingleCustomColumnConfigObj}></grid-pro-column>
  <grid-pro-column :definition=${x => x.myOtherSingleCustomColumnConfigObj}></grid-pro-column>

</foundation-grid-pro>
```
