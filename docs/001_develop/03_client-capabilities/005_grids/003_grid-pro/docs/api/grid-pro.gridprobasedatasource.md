---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/grid-pro](./grid-pro.md) &gt; [GridProBaseDatasource](./grid-pro.gridprobasedatasource.md)

## GridProBaseDatasource class


**Signature:**

```typescript
export declare class GridProBaseDatasource extends GenesisGridDatasourceElement 
```
**Extends:** [GenesisGridDatasourceElement](./grid-pro.genesisgriddatasourceelement.md)

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [agTransaction](./grid-pro.gridprobasedatasource.agtransaction.md) | <code>protected</code> | RowDataTransaction \| ServerSideTransaction |  |
|  [applyAsyncFuncName](./grid-pro.gridprobasedatasource.applyasyncfuncname.md) | <code>protected</code> | string |  |
|  [applyFuncName](./grid-pro.gridprobasedatasource.applyfuncname.md) | <code>protected</code> | string |  |
|  [connectionSub](./grid-pro.gridprobasedatasource.connectionsub.md) | <code>protected</code> | Subscription \| undefined |  |
|  [dataSubWasLoggedOff](./grid-pro.gridprobasedatasource.datasubwasloggedoff.md) | <code>protected</code> | boolean |  |
|  [pagination](./grid-pro.gridprobasedatasource.pagination.md) | <p><code>protected</code></p><p><code>readonly</code></p> | boolean |  |
|  [rowData](./grid-pro.gridprobasedatasource.rowdata.md) |  | Map&lt;string, any&gt; |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [applyAllAgTransactions()](./grid-pro.gridprobasedatasource.applyallagtransactions.md) | <code>protected</code> |  |
|  [applyTransaction(agTransaction)](./grid-pro.gridprobasedatasource.applytransaction.md) | <code>protected</code> |  |
|  [applyTransactionAsync(agTransaction, callback)](./grid-pro.gridprobasedatasource.applytransactionasync.md) | <code>protected</code> |  |
|  [connectedCallback()](./grid-pro.gridprobasedatasource.connectedcallback.md) |  |  |
|  [destroy()](./grid-pro.gridprobasedatasource.destroy.md) |  |  |
|  [disconnectedCallback()](./grid-pro.gridprobasedatasource.disconnectedcallback.md) |  |  |
|  [generateColumnDefsFromMetadata(fieldsMetadata, getFilterParamsByFieldType)](./grid-pro.gridprobasedatasource.generatecolumndefsfrommetadata.md) | <code>protected</code> |  |
|  [getDatasourceStatusBarPanels(isServerSide)](./grid-pro.gridprobasedatasource.getdatasourcestatusbarpanels.md) |  | Gets datasource-specific status bar component configurations. This method should be called by the grid to get status bar panels specific to this datasource. |
|  [handleStreamDeletes(deletedRows)](./grid-pro.gridprobasedatasource.handlestreamdeletes.md) | <code>protected</code> |  |
|  [handleStreamInserts(insertedRows, addIndex)](./grid-pro.gridprobasedatasource.handlestreaminserts.md) | <code>protected</code> |  |
|  [handleStreamUpdates(updatedRows)](./grid-pro.gridprobasedatasource.handlestreamupdates.md) | <code>protected</code> |  |
|  [isDisconnected()](./grid-pro.gridprobasedatasource.isdisconnected.md) |  | Returns true if the grid has the ds-disconnected attribute. |
|  [loadMore()](./grid-pro.gridprobasedatasource.loadmore.md) |  |  |
|  [reloadResourceData()](./grid-pro.gridprobasedatasource.reloadresourcedata.md) |  |  |
|  [restart()](./grid-pro.gridprobasedatasource.restart.md) |  |  |
|  [setDisconnected(disconnected)](./grid-pro.gridprobasedatasource.setdisconnected.md) |  | Sets or removes the ds-disconnected attribute on the grid element. |
|  [subscribeToConnection()](./grid-pro.gridprobasedatasource.subscribetoconnection.md) | <code>protected</code> |  |
|  [unsubscribeFromConnection()](./grid-pro.gridprobasedatasource.unsubscribefromconnection.md) | <code>protected</code> |  |

