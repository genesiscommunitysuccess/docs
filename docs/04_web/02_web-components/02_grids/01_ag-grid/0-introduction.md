---
id: ag-grid-intro
title: Introduction
---

A feature-rich grid for scenarios where you need the full power of [AG Grid](https://www.ag-grid.com/).

This is our Web Component wrapper for AG Grid.

## Use cases

There are two main use cases for our AG Grid component: **simple data** and **connected data** cases:

#### Simple data

:::tip
A good scenario for this is when there's no need for streams or you're using a non-Genesis-based data source (e.g. a custom REST API).
:::

:::info
This is also a scenario where our [DataGrid](/web/web-components/grids/data-grid/) could be used if the business requirements allow something more limited in features.
:::

The **simple data** use case is when you have your own data model and flow (JSON, external/custom REST APIS, etc) but still want to use a rich data grid (AG Grid) component with all  its features (filtering, sorting, custom cell renderers, etc).

This use case requires the client app to handle all the data transformations/updates/deletes/cell renderers in the grid.

#### Connected data

:::tip
This is the most common use case for our AG Grid component. When connecting to a [Data Server](/server/data-server/introduction/) or [Request Server](/server/request-server/introduction/).
:::

:::warning
For this use case, a separate `ag-genesis-datasource` component is required with a valid `resourceName`. More details [here](/web/web-components/grids/ag-grid/ag-genesis-datasource/).
:::

The **connected data** use case is when you have a [Data Server](/server/data-server/introduction/) or [Request Server](/server/request-server/introduction/) available/ready to use and don't want to worry about handling data transformations/updates/deletes/cell renderers in the grid (for cell renders it's flexible so you can use any component you want or the ones provided by default).

`ag-genesis-datasource`

## Attributes and props

- **`agGridFontFace: string`**: The font face to be used in the the grid. <br /> *Defaults to **'agGridAlpine'** but is replaced with **'Roboto'** font family when using `<zero-ag-grid>`.*

- **`autoCellRendererByType: boolean`**: Whether to automatically use a custom cell renderer for a given type. Defaults to `false`. When set to `true` will detect the metadata of the resource and use the appropriate cell renderer. We're currently supporting BOOLEAN, DATE and DATETIME types (with more to come soon). <br /> *Defaults to **'false'**.* <br /> **This will only work for [Connected Data](/web/web-components/grids/ag-grid/ag-grid-connected/) scenarios.**

- **`columnComponentName: string`**: **EXPERIMENTAL** | The name of the custom [Column](/web/web-components/grids/ag-grid/ag-genesis-column/) config component to be used for custom/extra column definitions. Defaults to **'ag-grid-column'** but can be replaced with something else (keep in mind that we're expecting a **definition** prop, without it the slotted config won't work/tale place).

- **`eventsAndCallbacks: any`**: The events and callbacks to override AG Grid's own [events](https://www.ag-grid.com/javascript-data-grid/grid-events/) and [callbacks](https://www.ag-grid.com/javascript-data-grid/grid-callbacks/). <br /> *Default is empty, no overrides.*

- **`headerHeight: number`**: The height of the header in pixels. <br /> *Defaults to **'32'** when using `<zero-ag-grid>`*

- **`onlyTemplateColDefs: boolean`**: Whether to use only the template column definitions (no extra column definitions). <br /> *Defaults to **'false'**.*

- **`rowHeight: number`**: The height of a row in pixels. <br /> *Defaults to **'32'** when using `<zero-ag-grid>`*

- **`rowNodeId: string`**: The id to be used in AG Grid's own [getRowNodeId](https://www.ag-grid.com/javascript-data-grid/accessing-data/#accessing-rownode-by-id/). <br /> Defaults to *'ROW_REF'* but can be set to any string (e.g. *'MY_UNIQUE_ID'*  from a [Request Server](/server/request-server/introduction/) query) <br /> **This will only work for [Connected Data](/web/web-components/grids/ag-grid/ag-grid-connected/) scenarios.**

- **`theme`**: The theme to use for the grid. <br /> *Defaults to **'ag-theme-rapid'** when using `<zero-ag-grid>` and to **'ag-theme-alpine'** when using `<foundation-ag-grid>`.*

- **`persist-column-state-key`**: Controls the persistence of the column's states (order, size, etc.) across sessions. Column state will not be persisted without this key. The persisted data is stored in the user's local storage in an object, keyed with this key if it is set, so each table must have a unique key in your application.  <br /> *Defaults to being unset which will mean the grid will **not** persist the column settings.*

## Default overrides

A given custom [Design System](/web/design-systems/introduction/) may have its own AG Grid variant, extending the base `foundation-ag-grid` and overriding the following by default:

- `theme` attribute and its `themeChanged` event for custom style/theme related logic. See *example* below:

```ts {5,6}
/**
 * Sets a CUSTOM default theme
 * @override
 */
theme = defaultRapidTheme;
themeChanged(oldValue: string, newValue: string) {
  if (!oldValue && newValue !== defaultRapidTheme) return;
  super.themeChanged(oldValue, newValue);
}
```
- `gridOptions` setter for extending/adding extra [GridOptions](https://www.ag-grid.com/javascript-data-grid/grid-interface/#grid-options/) to the grid. See *example* below:

```ts {5}
/**
 * Handles extra CUSTOM GridOptions configs
 * @override
 */
set gridOptions(options) {
  options.components = {
    [AgRendererTypes.actionsMenu]: AgActionsMenuRenderer,
    [AgRendererTypes.boolean]: AgBooleanRenderer,
  };

  const isDefaultRapidTheme = this.theme === defaultRapidTheme;
  options.headerHeight = isDefaultRapidTheme ? defaultAgHeight : null;
  options.rowHeight = isDefaultRapidTheme ? defaultAgHeight : null;

  super.gridOptions = options;
}
```

