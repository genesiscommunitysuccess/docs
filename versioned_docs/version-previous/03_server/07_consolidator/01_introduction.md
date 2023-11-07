---
title: 'Consolidator - introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, consolidator, introduction]
tags:
  - server
  - consolidator
  - introduction





---


A Consolidator exists to aggregate data or perform calculations whenever the underlying data is changed.

Typical use cases are:

- Calculate real-time positions based on intra-day price changes.
- Calculate snapshot report of number of trades per day.
- Calculate snapshot numbers for a chart.

Consolidators listen to updates on an underlying database object: either a view or a table. When there are changes to that object, the Consolidator aggregates those changes and then outputs the aggregated data to a specified type: the output type.

There are two ways to use GPAL Consolidators:

- as a service: in this case, the output type must always be a table entity. The Consolidator service listens to table updates, and updates a target table.
- on demand (as a Consolidator object): the object can be used in code in other parts of your application to perform on-demand consolidations and what-if analysis. The output is not saved in your application's database.

## Consolidator as a service

````mermaid
graph TD
    A[INPUT - Table/View] --> |Notifies of data updates| B[ CONSOLIDATOR Service]
    B -->|Stores Consolidated data| C[OUTPUT - Table]
````

This is the standard method of using Consolidators. The Consolidator runs as a process (service) that you can monitor using the `mon` command. An individual Consolidator in your **consolidator.kts** file listens to a specific table and automatically updates an output table.

Consolidators are conventionally defined in the file **_application_-consolidator.kts**.

If your application is called *Tiresias*, your configuration file is **tiresias-consolidator.kts**.


## Consolidator on-demand (objects)

As an alternative to running a Consolidator as a service, you can create Consolidator objects as classes that can be used in code elsewhere in your application. They can be used in custom services, as well as in Request Servers and Event Handlers.

These Consolidators perform on-demand consolidations where the input can be:

- read directly from the database
- provided at runtime
- a combination of both of these

Effectively, that gives you three types of Consolidator object, which we shall introduce after the following simple example:

```kotlin
// consolidate database records:
val order: Order? = tradeConsolidator.get(Trade.ById("A"))
val orders: List<Order> = tradeConsolidator.getRange(Trade.ByOrderId("A"), 1).toList()
// consolidate runtime instances:
val order: Order? = tradeConsolidator.consolidate(trade)
val orders: List<Order> = tradeConsolidator.consolidate(trade1, trade2, trade3)
// what-if analysis, combine both database records and runtime instances:
val result = tradeConsolidator.whatIf(Trade.ByOrderId("2"), trade1, trade2)
```
### Three types of Consolidator object
In practice, you can create three types of Consolidator object to cover different use cases:

- **input-output**
- **read input table**
- **read output table**

To showcase each of these, we shall use simple examples based on the following simplified data models:

**Trade**

| ID | InstrumentID | Quantity | Price |
|----|--------------|----------|-------|

**TradeDetails**

| ID | InstrumentID | TotalQuantity | Notional |
|----|--------------|---------------|----------|

### Input - Output Consolidator

This type of Consolidator is not limited to tables. It can take any input and produce any output; that output can be used elsewhere in your application. 

For example, your Consolidator object can read a table of trades and create the sum of all trade values.

````mermaid
graph LR
    B[Input] --> C[Consolidator on Demand]
    C --> D[Output]
  
````

The consolidator can receive either a Trade or a List of Trades; it returns a List of TradeDetail. The consolidation process is:

<table>
<tr><th>Trade List (Runtime) </th><th></th><th>TradeDetail List (Runtime)</th></tr>
<tr><td>

| ID | InstrumentID | Quantity | Price |
|----|--------------|----------|-------|
| 1  | VOD          | 1        | 5     |
| 3  | BARC         | 2        | 2     |
| 4  | BARC         | 1        | 4     |

</td><td>
 &rarr;
</td><td>

| ID | InstrumentID | totalQuantity | Notional |
|----|--------------|---------------|----------|
| 1  | VOD          | 1             | 5        |
| 2  | BARC         | 3             | 8        |

</td></tr> </table>

Here is a simple example input-output Consolidator that handles this use case:

```kotlin
val trades:List<Trade> = createTrades()
val tradeConsolidator = consolidator<Trade, TradeDetails> {
    select {
        sum { price * quantity } into TradeDetails::totalNotional
        sum { quantity } into TradeDetails::totalQuantity
    }
    
    groupBy { TradeDetails.byInstrumentId(currencyId) } into {
        TradeDetails {
            tradeDetailsId = groupId.tradeDetailsId
        }
    }
}
var tradeDetails:List<TradeDetails> = tradeConsolidator.consolidate(trades)
```

### Read Input Table Consolidator

This type of Consolidator reads a table where data is changed and then creates an output; the output can be anything. 

For example, the Consolidator could read updates to a table of orders and check the table of trades to find other trades that match that order (by order number or by counterparty, for example).
````mermaid
graph LR
    N[Consolidator On Demand]
    M[Input Data] -->  N
    L[Input Table - from DB] --> N
    N -->O[Output Runtime Entity]
````

The consolidation process for this is:

<table>
<tr><th>Trade List (Runtime + DB) </th><th></th><th>TradeDetails List (Runtime)</th></tr>
<tr><td>

| ID | InstrumentID | Quantity | Price |
|----|--------------|----------|-------|
| 1  | VOD          | 1        | 5     |
| 3  | BARC         | 2        | 2     |
| 4  | BARC         | 1        | 4     |

| ID | InstrumentID | Quantity | Price |
|----|--------------|----------|-------|
| 8  | VOD          | 5        | 2     |
| 9  | BARC         | 5        | 3     |

</td><td>
 &rarr;
</td><td>

| ID | InstrumentID | TotalQuantity | Notional |
|----|--------------|---------------|----------|
| 1  | VOD          | 6             | 15       |
| 2  | BARC         | 8             | 23       |

</td></tr> </table>

Here is a simple example read-input-table Consolidator that handles this use case:

````kotlin
val runtimeTrades:List<Trade> = createTrades()
val dbTrades:List<Trade> = createDbTrades()

val db by lazy { asyncEntityDb }

val tradeConsolidator by lazy {
    db.dualConsolidator<TRADE, POSITION_DETAILS> {
        select {
            POSITION_DETAILS {
                sum { price * quantity } into NOTIONAL
                sum { quantity } into TOTAL_QUANTITY
            }
        }

        groupBy { TradeDetails.byInstrumentId(currencyId) }
        into {
            TradeDetails {
                tradeDetailsId = groupId.tradeDetailsId
            }
        }
    }
}
db.insertAll(dbTrades)

var tradeDetails:List<TradeDetails> = tradeConsolidator.consolidate(runtimeTrades)
````

### Read Output Table Consolidator

This type of Consolidator can read any type of input, but the output must be a table. 

For example, the Consolidator could read the output from a trade table (a new trade), and compare this to an order in the order table. It can then calculate the effect of the change in terms of how much of the order is outstanding and fulfilled.

````mermaid
graph LR
M[Input Data] -->  N[Consolidator On Demand]
L[Input Data] --> N[Consolidator On Demand]
N -->O[Output Table]
````

The consolidation process for this is:

<table>
<tr><th>Trade List (Runtime) + TradeDetails(DB) </th><th></th><th>TradeDetails List (Runtime)</th></tr>
<tr><td>

| ID | InstrumentID | Quantity | Price |
|----|--------------|----------|-------|
| 1  | VOD          | 1        | 5     |
| 3  | BARC         | 2        | 2     |
| 4  | BARC         | 1        | 4     |

| ID | InstrumentID | TotalQuantity | Notional |
|----|--------------|---------------|----------|
| 8  | VOD          | 100           | 1000     |

</td><td>
 &rarr;
</td><td>

| ID | InstrumentID | TotalQuantity | Notional |
|----|--------------|---------------|----------|
| 1  | VOD          | 101           | 1005     |
| 2  | BARC         | 3             | 8        |

</td></tr> </table>


Here is a simple example read-output-table Consolidator that handles this use case:

````kotlin
val runtimeTrades:List<Trade> = createTrades()

val db by lazy { asyncEntityDb }
val dbTradeDetails:List<TradeDetails> = createDbTradeDetails()

val tradeConsolidator by lazy {
    db.simulatingConsolidator<TRADE, TRADE_DETAILS> {
        select {
            TRADE_DETAILS {
                sum { price * quantity } into NOTIONAL
                sum { quantity } into TOTAL_QUANTITY
            }
        }

        groupBy { TradeDetails.byInstrumentId(instrumentId) } into {
            TradeDetails {
                tradeDetailsId = groupId.tradeDetailsId
            }
        }
    }
}
db.insertAll(dbTradeDetails)

var tradeDetails:List<TradeDetails> = consolidator.whatIf(runtimeTrades)

````
