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

### Simple data

The **simple data** use case is when you have your own data model and flow (JSON, external/custom REST APIs, etc) but still want to use a rich data grid component with all its features (filtering, sorting, custom cell renderers, etc).

This use case requires the client app to handle all the data transformations, updates, deletes and cell renderers in the grid.

:::tip
A good scenario for this is when there's no need for streams or you're using a non-Genesis-based data source (e.g. a custom REST API).
:::

:::info
This is also a scenario where our [DataGrid](../../../../../web/web-components/grids/data-grid/) could be used if the business requirements require something more limited in features.
:::

### Connected data

The **connected data** use case is when you have a [Data Server](../../../../../server/data-server/introduction/) or [Request Server](../../../../../server/request-server/introduction/) available and ready to use, and you don't want to worry about handling data transformations, updates, deletes and cell renderers in the grid. (For cell renders, it's flexible, so you can use the components provided by default or any component you want.)

:::tip
This is the most common use case for the Grid Pro component. When connecting to a [Data Server](../../../../../server/data-server/introduction/) or [Request Server](../../../../../server/request-server/introduction/).
:::


## Attributes and props

| Name | Type | Default | Description |
|------|------|---------|-------------|
|autoCellRendererByType | `boolean` | `false` | Controls whether to use a custom cell renderer for a given type automatically. When set to `true`, this detects the metadata of the resource and uses the appropriate cell renderer. We're currently supporting BOOLEAN, DATE and DATETIME types (with more to come soon). This can only be used with connected data |
|grid-autosizing | `boolean` | `false` | Controls whether the grid autosizes the columns on interaction. This disables the column widths from being set manually, and if you are using the `persist-column-state-key` attribute, it doesn't save the widths in local storage. |
|columnComponentName | `string` | - | The name of the custom [Column](../../../../../web/web-components/grids/grid-pro/grid-pro-genesis-column/) config component to be used for custom/extra column definitions. Defaults to **'grid-pro-column'**, but can be replaced with something else. Keep in mind that we're expecting a **definition** prop; without it, the slotted config won't work). |
|enable-row-flashing | `boolean` | `false` | If true, enables row flashing for all rows. |
|eventsAndCallbacks | `any` | - | The events and callbacks |
|headerHeight | `number` | 32 | The height of the header in pixels. |
|onlyTemplateColDefs | `boolean` | `false` | Whether to use only the template column definitions (no extra column definitions) |
|rowHeight | `string` | 32 | The height of a row in pixels. |
|rowNodeId | `string` | `ROW_REF` | The id to be used in each row. |
|theme | `string` | `ag-theme-rapid` for zero-grid-pro and `ag-theme-alpine` for foundation-grid-pro | The theme to use for the grid. You can access the available themes [here](https://www.ag-grid.com/javascript-data-grid/themes/) |
|persist-column-state-key | `string` | - | Controls the persistence of the column's states (order, size, etc.) across sessions. Column state will not be persisted without this key. The persisted data is stored in the user's local storage in an object, keyed with this key if it is set - so each table must have a unique key in your application. |

All these attributes can be used with the ag-grid. Since we have different use cases, you can follow the [simple data](../grid-pro-simple/) or [connected data](../grid-pro-connected/) for further examples.


## Grid options

The grid has a very important method called: `gridOption`. In this method, you define all options available in the grid. Take a look at [this link](https://www.ag-grid.com/javascript-data-grid/grid-options/) to see all the available options.

## Grid events and callbacks

There is a large number of events and callbacks provided by the grid. You can find details of these on the [ag.com site](https://www.ag-grid.com/javascript-data-grid/grid-events/) site. There is a lot of potential in these, and this site is well worth exploring at length.

## Default overrides

A custom [Design System](../../../../../web/design-systems/introduction/) can have its own Grid Pro variant, extending the base `foundation-grid-pro` and overriding the `theme` attribute and its `themeChanged` event for custom style/theme-related logic. See the example below:

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

