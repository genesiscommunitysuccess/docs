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

This is a `slotted` component that allows a more visual approach to defining columns. Each `<grid-pro-column>` takes a `ColDef` typed object. To check all the available fields for the variable type `coldef`, take a [look here](https://www.ag-grid.com/javascript-data-grid/column-properties/).

:::tip
Customising column definitions using this approach is useful in **connected data** cases, where the data is dynamic; but there's still a need for extra definitions (e.g. events, transformers, etc).
:::

## Usage

To create or configure columns in the grid, there are two main things that you need to consider:
- Create a `ColDef` variable.
- Implement the columns.

### ColDef

A new `ColDef` variable needs to be created. This variable must store the configuration for all the columns in your grid. There is an extensive list of fields and parameters that can be used. Here are the most common fields:


|Name  | Type | Description|
|------|------|-------|
|`field` | String | Name of the field to be connected with |
|`checkboxSelection` | boolean | Set `true` to enable selection checkbox to your grid |
|`editable` | boolean | Sets the the column to be editable |
|`filter`| String | Sets the [type of the filter](https://www.ag-grid.com/javascript-data-grid/filtering/#column-filter-types) |
| `headerName` | String | Name of the header|
|`pinned` | any | Sets the column to be pinned. It can be: `boolean`, `left`, `right`, `null` |
|`autoHeight` | boolean | If set to `true`, the grid will select the appropriate height for the row |
|`cellRenderer` | any | Renders a component into each cell of this column |
|`cellRendererParams` | any | Parameters to be passed to the `cellRenderer`|
|`sortable`| boolean | If set to `true`, the column will be sortable |
|`sort` | `asc` or `desc` | Set the column to be sorted ascending or descending|
|`width`| Number | The width of the column |

To know more fields and configurations that can be used, please follow the [ag-grid documentation](https://www.ag-grid.com/javascript-data-grid/column-properties/).

Here is an example `ColDef` definition. In this example, it's being set in the context/component's own class, so we use `public` to access it. If you place the definition somewhere else, you need to access it in a different way.

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

```jsx title="Single column defintion"
public mySingleCustomColumnConfigObj: ColDef =
  {
    headerName: 'Type',
    field: 'type',
    width: 50,
    // cellRenderer, etc
  }
;
```

### Implement the columns

#### Single column
To create a new column with the definitions provided by the `ColDef`, insert a new component called `<grid-pro-column>`. Each `<grid-pro-column>` must be assigned to one `ColDef`. The basic implementation is:

```html title="Defining a single custom column"
<foundation-grid-pro>
 <grid-pro-column :definition=${(x) => x.mySingleCustomColumnConfigObj} />
</foundation-grid-pro>
```

By doing this, you are defining a single custom column.

<details><summary>Not seeing anything?</summary>
<p>

If you try to implement this code, you might not be able to see the grid created, because this grid has no data. However, once you [connect your grid with the back-end](../grid-pro-connected) or [insert simple data manually](../grid-pro-simple), you will be able to see the grid with your custom column.

</p>
</details>

#### Multiple columns

If you want to create multiple columns at once, you can use the `repeat` directive. 

This is how you can implement multiple custom columns defined in the variable `myMultipleCustomColumnConfigArray`:

```html {1,7-9} title="Using repeat to create multiple columns"
import {html, ref, repeat} from '@microsoft/fast-element';

...

export const YourTemplate = html<YourTemplate>`
    <foundation-grid-pro>
        ${repeat((x) => x.myMultipleCustomColumnConfigArray, html`
          <grid-pro-column :definition="${x => x}" />
          `)}
    </foundation-grid-pro>
`;
```
Note that inside the repeat directive, the context is `myMultipleCustomColumnConfigArray` instead of `YourTemplate`. This enables you to use `${x => x}` to access the `myMultipleCustomColumnConfigArray` elements.

For more information about the `repeat` directive, [follow this link](https://www.fast.design/docs/fast-element/using-directives/#the-repeat-directive).

:::tip A different way to create multiple columns
When using `ColDef` objects, it's up to you to decide the approach. You can use the directive **repeat** to create an array of definitions, or you can each column separately.

```html title="Using the ColDef array of objects with an extra single object"
<foundation-grid-pro>

  <grid-pro-column :definition=${x => x.mySingleCustomColumnConfigObj}></grid-pro-column>
  <grid-pro-column :definition=${x => x.myOtherSingleCustomColumnConfigObj}></grid-pro-column>

</foundation-grid-pro>
```
:::
### Connected data and custom columns

When you connect the grid with the back end using `<grid-pro-genesis-datasource />`, your grid automatically creates all the columns, based on the metadata from the server.

If you now create a new custom column defining the `field`, which must have the same name as a field in the back end, the grid sets the data to be displayed in this field. 
In the example below, the grid is connected to the back-end through a Data Server resource called `ALL_TRADES`; this has the fields `TRADE_ID`, `PRICE` and `QUANTITY`. 

```html
<foundation-grid-pro>
    <grid-pro-genesis-datasource resource-name="ALL_TRADES" />
</foundation-grid-pro>
```

If you don't define any additional columns, this is the grid that you will see:

![](/img/grid-trade-quantity-price.png)

Now, in the context/component's own class, you can define a new column. This example defines a `field` that has the same as a field in the back-end: **PRICE**. It pins the field to the right:

```ts
public myCustomColumn: ColDef =
  {
    headerName: 'Custom Name',
    field: 'PRICE',
    pinned: 'right'
  }
```

Then create a new custom column in your HTML template:

```html
<alpha-grid-pro>
    <grid-pro-genesis-datasource resource-name="ALL_TRADES" />
    <grid-pro-column :definition="${(x) => x.myCustomColumn}" />
</alpha-grid-pro>
```

This is the expected result:

![](/img/grid-custom-field.png)


## Custom renderers

If you want to add a web component inside the `grid-pro`, you can use two fields in the definition of the columns:
- **cellRenderer** is responsible for creating the structure of the cell. Here you need to return a string containing the HTML to be rendered in that cell.
- **cellRendererParams** enables you to include some additional parameters parameters to implement the `cellRenderer`.

This is how you need to define your `ColDef` to enable cell renderer:

```ts
const customCompleteDef: any = {
  headerName: 'Header Name',
  field: 'NAME_OF_THE_FIELD',
  cellRenderer: `<span> This is a custom rendering <span>`,
  },
};
```

Dynamic parameters can add detail to the cell renderer. In the following example, colour is passed as a parameter to the `cellRenderer` field:

```ts
const customCellRenderer = (params) => {
  return `<span>Value from params: ${params.value}</span>`;
};

const customCompleteDef: any = {
  headerName: 'Header Name',
  field: 'NAME_OF_THE_FIELD',
  cellRenderer: customCellRenderer,
  cellRendererParams: {
    value: 'Custom Value'
    }
  },
};
```

In the example above, you can change the return of the `customCellRenderer` variable to other web components, such as buttons or comboboxes.
