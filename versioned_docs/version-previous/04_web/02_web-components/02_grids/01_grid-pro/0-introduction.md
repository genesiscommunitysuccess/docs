---
id: grid-pro-intro
title: Grid Pro - Introduction
keywords: [web, web components, grid, grid pro, introduction]
tags:
    - web
    - web components
    - grid
    - grid pro
    - introduction
---

## Use cases

There are two main use cases for our Grid Pro component: **simple data** and **connected data** cases:

#### Simple data

The **simple data** use case is when you have your own data model and flow (JSON, external/custom REST APIS, etc) but still want to use a rich data grid component with all its features (filtering, sorting, custom cell renderers, etc).

This use case requires the client app to handle all the data transformations/updates/deletes/cell renderers in the grid.

:::tip
A good scenario for this is when there's no need for streams or you're using a non-Genesis-based data source (e.g. a custom REST API).
:::

:::info
This is also a scenario where our [DataGrid](../../../../../web/web-components/grids/data-grid/) could be used if the business requirements allow something more limited in features.
:::

#### Connected data

The **connected data** use case is when you have a [Data Server](../../../../../server/data-server/introduction/) or [Request Server](../../../../../server/request-server/introduction/) available/ready to use and don't want to worry about handling data transformations/updates/deletes/cell renderers in the grid (for cell renders it's flexible so you can use any component you want or the ones provided by default).

:::tip
This is the most common use case for Grid Pro component. When connecting to a [Data Server](../../../../../server/data-server/introduction/) or [Request Server](../../../../../server/request-server/introduction/).
:::


## Attributes and props

| Name | Type | Default | Description |
|------|------|---------|-------------|
|autoCellRendererByType | `boolean` | `false` | Controls whether automatically use a custom cell renderer for a given type. When set to `true` will detect the metadata of the resource and use the appropriate cell renderer. We're currently supporting BOOLEAN, DATE and DATETIME types (with more to come soon). Can only be used with connected data |
|grid-autosizing | `boolean` | `false` | Controls whether the grid autosizes the columns upon interaction. This will disable the column widths from being manually set, and doesn't save the widths in local storage if you are using `persist-column-state-key` attribute. |
|columnComponentName | `string` | - | The name of the custom [Column](../../../../../web/web-components/grids/grid-pro/grid-pro-genesis-column/) config component to be used for custom/extra column definitions. Defaults to **'grid-pro-column'** but can be replaced with something else (keep in mind that we're expecting a **definition** prop, without it the slotted config won't work/tale place). |
|enable-row-flashing | `boolean` | `false` | If true, will enable row flashing for all rows. |
|eventsAndCallbacks | `any` | - | The events and callbacks |
|headerHeight | `number` | 32 | The height of the header in pixels. |
|onlyTemplateColDefs | `boolean` | `false` | Whether to use only the template column definitions (no extra column definitions) |
|rowHeight | `string` | 32 | The height of a row in pixels. |
|rowNodeId | `string` | `ROW_REF` | The id to be used in each row. |
|theme | `string` | `ag-theme-rapid` for zero-grid-pro and `ag-theme-alpine` for foundation-grid-pro | The theme to use for the grid. You can access the available themes [here](https://www.ag-grid.com/javascript-data-grid/themes/) |
|persist-column-state-key | `string` | - | Controls the persistence of the column's states (order, size, etc.) across sessions. Column state will not be persisted without this key. The persisted data is stored in the user's local storage in an object, keyed with this key if it is set, so each table must have a unique key in your application. |

All these attributes can be used with the ag-grid. Since we have different use cases, you can follow the [simple data](../grid-pro-simple/) or [connected data](../grid-pro-connected/) for futher examples.


## Grid Options

The grid has a very important method called: `gridOption`. In this method, you define all options available in the grid. Take a look in [this link](https://www.ag-grid.com/javascript-data-grid/grid-options/) so you get used with all available options.

## Default overrides

A given custom [Design System](../../../../../web/design-systems/introduction/) may have its own Grid Pro variant, extending the base `foundation-grid-pro` and overriding the following by default:

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
- `gridOptions` setter for extending/adding extra GridOptions to the grid. See *example* below:

```ts {5}
/**
 * Handles extra CUSTOM GridOptions configs
 * @override
 */
set gridOptions(options) {
  options.components = {
    [GridProRendererTypes.actionsMenu]: ActionsMenuRenderer,
    [GridProRendererTypes.boolean]: BooleanRenderer,
  };

  const isDefaultRapidTheme = this.theme === defaultRapidTheme;
  options.headerHeight = isDefaultRapidTheme ? defaultAgHeight : null;
  options.rowHeight = isDefaultRapidTheme ? defaultAgHeight : null;

  super.gridOptions = options;
}
```

