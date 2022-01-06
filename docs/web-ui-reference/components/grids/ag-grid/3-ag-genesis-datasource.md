---
id: ag-genesis-datasource
title: Genesis Datasource
sidebar_position: 13
---

Used in [Connected Data](/web-ui-reference/components/grids/ag-grid/ag-grid-connected/) scenarios, will fetch data from a Genesis server (or any other server that implements the Genesis protocol). <br /> <br /> *Available Attributes & Props may change in the future and are open for feedback but are reflecting the [DATA_LOGON message options](/platform-reference/configure-key-modules/data-servers/examples/#client-side-runtime-options)*

## Attributes & Props

- **`criteria: string`**: Clients can send a Groovy expression to perform filters on the query server; these remain active for the life of the subscription. For example: Expr.dateIsBefore(TRADE_DATE,'20150518') or QUANTITY > 10000.

- **`fields: boolean`**: Smilar to `request` but for [Data Server](/platform-reference/configure-key-modules/data-servers/configure/) scenarios. This optional parameter allows you to select a subset of fields from the query if the client is not interested in receiving all of them. Example: "TRADE_ID QUANTITY PRICE INSTRUMENT_ID". By default all fields are returned if this option is not specified.

- **`isSnapshot: boolean`**: Defaults to false. 

- **`maxRows: number`**: Maximum number of rows to be returned as part of the initial message, and as part of any additional MORE_ROWS messages

- **`maxView: number`**: Maximum number of rows to track as part of a client "view"

- **`orderBy: string`**: This option can be used to select a data server index (defined in xml), which is especially useful if you want the data to be sorted in a specific way. By default, data server rows will be returned in order of creation (from oldest database record to newest).

- **`request: any`**: Similar to `fields` but for [Request Server](/platform-reference/configure-key-modules/request-servers/configure/) scenarios. This optional parameter allow you to specify request fields which can include wildcards. Example: you could request all RIC Codes for example, or all RIC Codes beginning with "V" for example.

- **`resourceName: string`**: The target [Data Server](/platform-reference/configure-key-modules/data-servers/configure/) or [Request Server](/platform-reference/configure-key-modules/request-servers/configure/) name. Example: "ALL_TRADES" or "ALT_COUNTERPARTY_ID"

- **`reverse: boolean`**: This option changes the data server index iteration. For example, if you are using the default index, they query will return rows from newest database records to oldest.

## Usage (0.0.18+)

```html title="Streaming data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-ag-grid>
    <ag-genesis-datasource 
      resourceName="ALL_PROCESSES_STATUS" 
      isSnapshot="true" 
      fields="PROCESS_NAME LOG_LEVEL" />
    ...
  </alpha-ag-grid>
  ...
</alpha-card>