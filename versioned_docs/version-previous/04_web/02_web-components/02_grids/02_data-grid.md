---
title: 'Data grid'
sidebar_label: 'Data grid'
id: data-grid
keywords: [web, web components, grid, data grid]
tags:
    - web
    - web components
    - grid
    - data grid
---


A more light-weight grid for scenarios where you don't need the full power of [Grid Pro](../../../../web/web-components/grids/grid-pro/grid-pro-intro/).

The `alpha-data-grid` component is used to display tabular data. The `alpha-data-grid-row` and `alpha-data-grid-cell` components are typically created programmatically by the parent grid, but you may find it useful to create them manually.

## Set-up

```ts
import { provideDesignSystem, alphaDataGrid, alphaDataGridCell, alphaDataGridRow } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaDataGrid(), alphaDataGridCell(), alphaDataGridRow());
```

## Usage
There are two ways of using this component. We shall look at each in turn.

### Ref method

1. Import `ref` from `@microsoft/fast-element`. This must be done in the same place where you are defining the structure of your template.

```typescript
import {html, ref} from '@microsoft/fast-element';
```

2. In the same file, add the following code inside the html structure to create a reference:

```html
<alpha-data-grid ${ref('samplegrid')}></alpha-data-grid>    
```

3. Inside the file where you define the class (for example, the `Home` class), import the data grid:

```
import {DataGrid} from '@genesislcap/foundation-ui'
```

4. Inside the class, get the reference name you created and set it to be of the type `DataGrid`:

```ts
samplegrid: DataGrid;
```
5. Inside a function, for example, `connectedCallback()`, place this code - which includes some dummy data):

```ts
this.samplegrid.rowsData= [
  { item1: 'value 1-1', item2: 'value 2-1' },
  { item1: 'value 1-2', item2: 'value 2-2' },
  { item1: 'value 1-3', item2: 'value 2-3' },
];
```
That's it; now you have a grid with dummy data. 

### Getting the element by ID

1. In your html structure, create an ID for your Data Grid. Add the following code:

```html
<alpha-data-grid id='samplegrid'></alpha-data-grid>    
```

2. Inside the file where you define the class (for example, the `Home` class), import the data grid:

```
import {DataGrid} from '@genesislcap/foundation-ui'
```

3. Inside a function, for example, `connectedCallback()`, search for the ID to get the element that you created, then define it as type `DataGrid`:

```ts
const data = this.shadowRoot.getElementById('samplegrid') as DataGrid
```
4. In the same function, create some dummy data for your grid, for example:

```ts
data.rowsData = [ { item1: 'value 1-1', item2: 'value 2-1' },
                  { item1: 'value 1-2', item2: 'value 2-2' },
                  { item1: 'value 1-3', item2: 'value 2-3' }
                ];
```

That's it; now you have a grid with dummy data. 

## Connected data

To retrieve information from Data Servers and Request Servers, you need to use the `<data-grid>` with the `<data-grid-datasource>` component. Here is an example:

```html
<zero-data-grid>
  <data-grid-datasource resourceName="ALL_TRADES"></data-grid-datasource>
</zero-data-grid>
```

## Use cases

* Tabular data

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
