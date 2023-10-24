---
id: grid-pro-genesis-datasource
title: Grid Pro - Genesis datasource
keywords: [web, web components, grid, grid pro, datasource]
tags:
    - web
    - web components
    - grid
    - grid pro
    - datasource
---

Used in [Connected Data](../../../../../web/web-components/grids/grid-pro/grid-pro-connected/) scenarios, this will fetch data from a Genesis server (or any other server that implements the Genesis protocol).

*All available attributes and pops are reflecting the [DATA_LOGON messages options](../../../../../server/integration/rest-endpoints/basics/#data_logon)*

## Attributes and props

- **`criteria: string`**: Clients can send a Groovy expression to perform filters on the query server; these remain active for the life of the subscription. For example: Expr.dateIsBefore(TRADE_DATE,'20150518') or QUANTITY > 10000.

- **`fields: boolean`**: Similar to `request` but for [Data Server](../../../../../server/data-server/introduction/) scenarios. This optional parameter allows you to select a subset of fields from the query if the client is not interested in receiving all of them. Example: "TRADE_ID QUANTITY PRICE INSTRUMENT_ID". By default all fields are returned if this option is not specified.

- **`isSnapshot: boolean`**: Defaults to false.

- **`max-rows: number`**: Maximum number of rows to be returned as part of the initial message, and as part of any additional MORE_ROWS messages

- **`max-view: number`**: Maximum number of rows to track as part of a client "view"

- **`moving-view: boolean`**: If true, when the maximum number of rows defined in `max-view` is reached, the Data Server will start discarding the oldest rows (in terms of timestamp) and sending newer rows. If false, the updates in the server will be sent to the front end regardless of order. Note that this will only update the UI, no changes will be performed in the database.

- **`order-by: string`**: This option can be used to select a [Data Server index](../../../../../database/data-types/index-entities/) (defined in xml), which is especially useful if you want the data to be sorted in a specific way. By default, data server rows will be returned in order of creation (from oldest database record to newest).

- **`request: any`**: Similar to `fields` but for [Request Server](../../../../../server/request-server/introduction/) scenarios. This optional parameter allow you to specify request fields which can include wildcards. Example: you could request all RIC Codes for example, or all RIC Codes beginning with "V" for example.

- **`resource-name: string`**: The target [Data Server](../../../../../server/data-server/introduction/) or [Request Server](../../../../../server/request-server/introduction/) name. Example: "ALL_TRADES" or "ALT_COUNTERPARTY_ID"

- **`reverse: boolean`**: This option changes the [Data Server index](../../../../../database/data-types/index-entities/) iteration. For example, if you are using the default index, they query will return rows from newest database records to oldest.

- **`polling-interval: number`**: This option allows you to set a custom polling frequency (in milliseconds) for a [request server](../../../../../server/request-server/introduction/) resource. Note that this option only works with request server, if you resource is a dataserver, your grid is updated in real time.

### examples

Here is an example using `grid-pro-genesis-datasource` with a maximum number of displayed to 5 and setting up `moving-view`:

```typescript title="Example of moving-view"
<alpha-grid-pro>
    <grid-pro-genesis-datasource 
        resource-name="ALL_TRADE"
        max-view="4"
        moving-view="true" />
    ...
</alpha-grid-pro>
...
```

Below you find an example of `grid-pro-genesis-datasource` including `max-row`, `max-view`, `moving-view`, `fields`, `isSnapshot` and `resource-name`

```typescript title="Using a grid-pro with grid-pro-genesis-datasource"
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

Lastly, an example of how to use `grid-pro-genesis-datasource` with `polling-interval`, setting the pulling frequency to 10 seconds. Remember to set a request server in order to use the `polling-interval` option.

```typescript title="Example of polling-interval"
<alpha-grid-pro>
    <grid-pro-genesis-datasource 
        resource-name="REQUEST_SERVER_ALL_TRADE"
        polling-interval="10000" />
    ...
</alpha-grid-pro>
...
```
