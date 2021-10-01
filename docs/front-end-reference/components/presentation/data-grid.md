

# data-grid

The `alpha-data-grid` component is used to display tabular data. The `alpha-data-grid-row` and `alpha-data-grid-cell` components are typically created programmatically by the parent grid but some authors may find it useful to create them manually.

## Setup

```ts
import { provideDesignSystem, alphaDataGrid, getDataGridCell, getDataGridRow } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaDataGrid(), getDataGridCell(), getDataGridRow());
```

## Usage

```html
<alpha-data-grid id="samplegrid"></alpha-data-grid>
```

Note that data must be provided to the grid by setting a property.

```ts
document.getElementById('samplegrid').rowsData = [
  { item1: 'value 1-1', item2: 'value 2-1' },
  { item1: 'value 1-2', item2: 'value 2-2' },
  { item1: 'value 1-3', item2: 'value 2-3' },
];
```

## Use cases

Any time an author wants to display tabular data.

## Additional resources

- [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#grid)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/data-grid/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/data-grid/data-grid.styles.ts)
