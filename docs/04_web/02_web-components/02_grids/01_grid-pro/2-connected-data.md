---
id: grid-pro-connected
title: Grid Pro - Connected data
keywords: [web, web components, grid, grid pro]
tags:
    - web
    - web components
    - grid
    - grid pro
---

The **connected data** use case is when you have a [Data Server](../../../../../server/data-server/introduction/) or [Request Server](../../../../../server/request-server/introduction/) available/ready to use and don't want to worry about handling data transformations/updates/deletes/cell renderers in the grid (for cell renders it's flexible so you can use any component you want or the ones provided by default).

In order to be able to use the connected version of the grid-pro, you need to use the `<grid-pro-genesis-datasource>` component.

## Set-up

:::info
In the examples below, we refer to a sample `@genesislcap/alpha-design-system` design system with an `alpha` prefix. Your design system would probably have a different name/prefix, while still exposing the same API.
:::

```ts
import { provideDesignSystem } from '@genesislcap/alpha-design-system';
import { foundationGridComponents } from '@genesislcap/grid-pro';

provideDesignSystem().register(alphaAgGrid(), foundationGridComponents);
```

## Grid Pro Genesis Datasource

Below you find the attributes that needs to be used with the `<grid-pro-genesis-datasource>`: 

|Name|Type|Default|Description|
|----|----|-------|-----------|
|criteria|`string`| - |Clients can send a Groovy expression to perform filters on the query server; these remain active for the life of the subscription.|
|fields| `string` | - | This optional parameter allows you to select a subset of fields from the query if the client is not interested in receiving all of them. |
|isSnapshot| `boolean` | `false` | request a snapshot from the server |
|max-rows| `number` | - | Maximum number of rows to be returned as part of the initial message, and as part of any additional MORE_ROWS messages. **This will not affect the number displayed rows**|
|max-view| `number` | - | Maximum number of rows to track as part of a client "view" |
|moving-view| `boolean` | `false` | If true, when the maximum number of rows defined in `max-view` is reached, the Data Server will start discarding the oldest rows (in terms of timestamp) and sending newer rows. If false, the updates in the server will be sent to the front end regardless of order. Note that this will only update the UI, no changes will be performed in the database.|
|order-by| `string` | - | This option can be used to select a [Data Server index](../../../../../database/data-types/index-entities/) (defined in xml), which is especially useful if you want the data to be sorted in a specific way. By default, data server rows will be returned in order of creation (from oldest database record to newest).|
|request| `string` | - | Similar to `fields` but for [Request Server](../../../../../server/request-server/introduction/) scenarios. This optional parameter allow you to specify request fields which can include wildcards.|
|resource-name| `string` | - | The target [Data Server](../../../../../server/data-server/introduction/) or [Request Server](../../../../../server/request-server/introduction/) name. |
| reverse | `boolean` | `false` | This option changes the [Data Server index](../../../../../database/data-types/index-entities/) iteration. For example, if you are using the default index, they query will return rows from newest database records to oldest.|
| polling-interval | `number` | - | This option allows you to set a custom polling frequency (in milliseconds) for a [request server](../../../../../server/request-server/introduction/) resource. Note that this option only works with request server, if you resource is a dataserver, your grid is updated in real time. |

## Examples

Below you'll find some examples of how to use the **grid-pro** with connected data. 

1. Grid with a maximum number of displayed rows to 5 and setting up `moving-view`:

```html title="Example 1"
<alpha-grid-pro>
    <grid-pro-genesis-datasource 
        resource-name="ALL_TRADE"
        max-view="4"
        moving-view="true" />
    ...
</alpha-grid-pro>
...
```

2. A grid including `max-row`, `max-view`, `moving-view`, `fields`, `isSnapshot` and `resource-name` attributes:

```html title="Example 2"
<alpha-grid-pro>
    <grid-pro-genesis-datasource 
        resource-name="ALL_PROCESSES_STATUS" 
        isSnapshot="true" 
        fields="PROCESS_NAME LOG_LEVEL" 
        max-view="4"
        max-row="5"
        moving-view="true" />
    ...
</alpha-grid-pro>
...
```

3. A grid with `polling-interval`, setting the pulling frequency to 10 seconds. Remember to set a request server in order to use the `polling-interval` option.

```html title="Example 3"
<alpha-grid-pro>
    <grid-pro-genesis-datasource 
        resource-name="REQUEST_SERVER_ALL_TRADE"
        polling-interval="10000" />
    ...
</alpha-grid-pro>
...
```

4. A grid with a snapshot of the ALL_PROCESS_STATUS query

```html title="Example 4"

<alpha-grid-pro>
    <grid-pro-genesis-datasource 
      resourceName="ALL_PROCESSES_STATUS" 
      isSnapshot="true" />
  ...
</alpha-grid-pro>
...
