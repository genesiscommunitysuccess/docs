---
title: 'Aggregation'
id: aggregation
---

# Aggregation

## Introduction

With Fuse you can perform aggregation on your data.

Typical use cases are:

- Calculating trade positions
- Calculating a snapshot report of the number of trades per day
- Calculating snapshot numbers for a chart

The Aggregator listens to updates on an underlying database object: either a view or a table. When there are changes to that object, those changes are aggregated and then the aggregated data is output to another table.

## Definition

You define an Aggregator as part of your data model definition.

Here is an example of a simple Aggregator you could define with the input table defined below it:

```kotlin
@Persist
object ORDER : AggregationTable<TRADE>(11_002, TRADE) {
    val orderId by varchar().generated().immutable()
    val totalNotional by sum { price * quantity }
    val tradeCount by count()
    val grouping by groupBy { tradeOrderId }

    override val primaryKey by primaryKey(orderId)
    
    init {
        where {
            tradeStatus neq TradeStatus.CANCELLED
        }
    }
}

@Persist
object TRADE : Table(11_001) {
    val tradeId by varchar().nonNullable().generated()
    val tradeOrderId by varchar().nonNullable()
    val side by enum(Side.BUY)
    val price by double().nonNullable()
    val quantity by integer().nonNullable()
    val tradeStatus by enum(TradeStatus.NEW)

    override val primaryKey by primaryKey(tradeId)
}
```

So, what is going on there?

- The Aggregator is listening to the `TRADE` table.
- It is publishing the aggregation results to the `ORDER` table.
- It is grouping its aggregation by the field `tradeOrderId`.
- It is counting the number of trades into `TRADE_COUNT` and calculating `price x quantity` into `TOTAL_NOTIONAL`.
- It is filtering records to aggregate based on the `where` criteria. In this case records that have `tradeStatus` of CANCELLED won't be aggregated.

## Functions

To apply aggregation to fields you can use functions such as `sum { feeAmount }`. All functions require an input except for `count` and `countBig`. With those functions the input is optional. See the below table for a further description of each function.

:::tip
Within the curly brackets of the function, you can:
- access all fields on the input table row
- write simple conditional statements
- perform simple calculations using the following operators: +, -, *, /
:::

The function will be applied over the result, unless the result is null, in which case it will be ignored.

### Standard functions

| Function      | Description                                                                    | Input                 | Output        |
|:--------------|--------------------------------------------------------------------------------|-----------------------|---------------|
| sum           | sums values in the value field                                                 | any number            | same as input |
| count         | counts records that have a value (counts all records if no input is provided)  | anything (optional)   | INTEGER       |
| countDistinct | counts distinct value values                                                   | anything              | INTEGER       |
| countBig      | counts records that have a value (counts all records if no input is provided)  | any value (optional)  | LONG          |
| avg           | average value                                                                  | any number            | same as input |
| min           | minimum value                                                                  | any number            | same as input |
| max           | maximum value                                                                  | any number            | same as input |
| stdev         | standard deviation for value                                                   | any number            | DOUBLE        |
| stdevp        | population standard deviation for value                                        | any number            | DOUBLE        |
| variance      | statistical variance for value                                                 | any number            | DOUBLE        |
| variancep     | population statistical variance for value                                      | any number            | DOUBLE        |
| stringAgg     | string concatenation                                                           | any string            | STRING        |
| checksum      | calculates a hash over the input                                               | any value             | LONG          |
| first         | gets the value from the first record                                           | anything              | same as input |
| last          | gets the value from the last record                                            | anything              | same as input |
| any           | gets the value from any record                                                 | anything              | same as input |

### Simple conditionals

All functions except `first`, `last` and `any` can be considered calculation functions. Within the calculation functions you can also define simple conditional statements.
Based on a condition, you can specify which column should be used in the aggregation function.

See below for an example where if `side` equals `BUY` then `quantity` will be used, otherwise it will be `-quantity`:
```kotlin
check { side eq Side.BUY }
    .then { quantity }
    .orElse { -quantity }
```

And below, which has a second condition to test when the first condition is false:
```kotlin
check { quantity lt 1000 }
    .then { price }
    .orCheck { quantity gte 10_000 }
    .then { price * quantity }
    .orElse { -price * quantity }
```

The conditional expressions within `check` and `orCheck` support the following conditional operators:

| Conditional Operator | Description              |
|:---------------------|--------------------------|
| eq                   | Equal to                 |
| neq                  | Not equal to             |
| gt                   | Greater than             |
| lt                   | Less than                |
| gte                  | Greater than or equal to |
| lte                  | Less than or equal to    |

### Where clause

The `where` block will filter records prior to aggregation based on a condition. This must be defined in the object's `init` block.
The conditional operators supported are the same as in the conditional expressions shown above.

Example:
```kotlin
init {
    where {
        tradeStatus neq TradeStatus.CANCELLED
    }
}
```

## Full example

Below is an example of aggregating records from the `TRADE` table into the `POSITION` table: 

```kotlin
@Persist
object TRADE : Table(11_001) {
    val tradeId by varchar().nonNullable().generated()
    val instrumentId by varchar().nonNullable()
    val side by enum(Side.BUY)
    val price by double().nonNullable()
    val quantity by integer().nonNullable()
    val tradeStatus by enum(TradeStatus.NEW)

    override val primaryKey by primaryKey(tradeId)
}

@Persist
object POSITION : AggregationTable<TRADE>(11_002, TRADE) {
    val positionId by varchar().generated().immutable()
    val instrument by groupBy { instrumentId }
    val quantity by sum { quantity }
    val notional by sum { price * quantity }
    val lastPrice by last { price }
    val totalPosition by sum {
        check { side eq Side.BUY }
            .then { quantity }
            .orElse { -quantity }
    }
    val tradeCount by count()

    override val primaryKey by primaryKey(positionId)

    init {
        where {
            tradeStatus neq TradeStatus.CANCELLED
        }
    }
}
```