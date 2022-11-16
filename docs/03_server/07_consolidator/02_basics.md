---
title: 'Consolidator - basics'
sidebar_label: 'Basics'
id: basics
keywords: [server, consolidator, basics]
tags:
  - server
  - consolidator
  - basics
---

You define a Consolidator service in a **consolidator.kts** file. Within the file, you can define as many Consolidators as you like. Each one is specified in a `Consolidator` block of code. 



Here is an example of the simplest Consolidator you could define:

```kotlin
consolidator(TRADE, ORDER) {
    select {
        ORDER {
            sum { price * quantity } into TOTAL_NOTIONAL
            count() into TRADE_COUNT
        }
    }
    groupBy { Order.ById(orderId) } 
}
```
So, what was going on there?

- The Consolidator is listening to the `TRADE` table.
- It is publishing its aggregation to the `ORDER` table.
- It is grouping its aggregation by the field `orderID`.
- It is counting the number of trades into `TRADE_COUNT` and calculating price x quantity into `TOTAL_NOTIONAL`. 

## Elements of a Consolidator
In each `Consolidator` block, you must at least provide:

- a name
- an input table or view
- an output table

In most cases, you will need a lot more than that. Let us look at the elements you can use to create a sophisticated, effective Consolidator.

The empty structure below shows the optional and mandatory code blocks in a single `Consolidator` block.  
Comments are included to provide further information:

```kotlin
consolidators {
    config {
        // optional file-level configuration
    }
    // define a consolidation
    consolidator("NAME", INPUT_TABLE_OR_VIEW, OUTPUT_TABLE) {
        config {
            // optional consolidation configuration
        }
        select {
            // select block
        }
        onCommit {
            // optional onCommit block
        }
        groupBy {
            // groupBy block
        } into {
            //
        }
        where {
            // predicate
        }
        indexScanOn {
            // on demand index scan
        }
        reprocessSchedule {
            //
        }
    }
}
```
Now we shall look at each of the possible code blocks in more detail.

### config block (optional)

The config block is available at both the file and Consolidator level. File-level configuration will overwrite default
properties, and Consolidator properties will overwrite both.

| Property             | Description                                   | Supports Values                    | Default Value |
|----------------------|-----------------------------------------------|------------------------------------|---------------|
| defaultLogLevel      | the default log level for the Consolidator    | TRACE, DEBUG, INFO, WARN, ERROR    | TRACE           |
| onNotFound           | what to do if an output record is not found   | BUILD, WARN, IGNORE, FAIL, DEFAULT | TBC           |
| batchingPeriod       | the time in ms before writing to the database |                                    | TBC           |
| ignoreIndexScan      | disables index scans                          |                                    | TBC           |
| defaultErrorHandling | what to do if an exception is thrown          | IGNORE, WARN, FAIL                 | TBC           |

### select block

In the select block, you can specify functions and outputs, for example:


<Tabs defaultValue="tables" values={[{ label: 'Tables', value: 'tables', }, { label: 'Classes', value: 'classes', }]}>
<TabItem value="tables">

```kotlin
select {
    // add the output table here for a more concise syntax
    // this will go after kotlin supports multiple receivers
    COMMISSION_AND_FEES_SUMMARY {
        sum { feeAmount } into FEE_AMOUNT
        sum { originalFeeAmount } into ORIGINAL_FEE_AMOUNT
        sum { splitFeeAmount } into SPLIT_FEE_AMOUNT
    }
}
```

</TabItem>
<TabItem value="classes">


```kotlin
select {
    sum { feeAmount } into CommissionAndFeesSummary::feeAmount
    sum { originalFeeAmount } into CommissionAndFeesSummary::originalFeeAmount
    sum { splitFeeAmount } into CommissionAndFeesSummary::splitFeeAmount
}
```
</TabItem>
</Tabs>

### logging
For debugging purposes, the `select` block also supports logging. By default, the Consolidator logs all events with default level **TRACE**, but this can be overwritten with custom messages. To do this, use the `logJoin`, `logLeave` and `logNoop` blocks:

```kotlin
select {
    ...
    logJoin { LOG.info("row joined", input) }
    logLeave { LOG.info("row left", input) }
    logNoop { LOG.info("new row: {}, old row: {}", newInput, oldInput) }
}
```

### onCommit block (optional)

This block is optional. In the `onCommit` block, you can amend the output row, after all the functions have been
applied, but before it is written to the database. In the `onCommit` block, you have access to both the `input`
and the `output` objects. The `input` property can be any one of the input rows picked up during the consolidation,
so this should be handled with care.

This block can be useful to do further calculations based on the consolidated values, for example:

```kotlin
onCommit {
    val accruedInterest = if (input.isDirtyPrice) input.accruedInterest else 0.0
    val netAmount = input.notional + accruedInterest
    output.netAmount = when (input.side) {
        Side.BUY -> netAmount + output.totalTransactionCosts
        Side.SELL -> netAmount - output.totalTransactionCosts
    }
}
```

### groupBy into syntax

The syntax of `groupBy` is significantly different for standard Consolidators and object Consolidators.
For object Consolidators, table syntax is more complex, as records need to be loaded and created. Also, the table syntax supports
index scans, which need to be configured.

<Tabs defaultValue="tables" values={[{ label: 'Tables', value: 'tables', }, { label: 'Classes', value: 'classes', }]}>
<TabItem value="tables">

The `groupBy`-`into` syntax determines:
- how records are grouped `groupBy { ... } `
- how the Consolidator interacts with the database `into { ... }`
    * how output records are loaded from the database `into { lookup { ... } }`
    * how output records are built when no record is found in the database `into { build { ... } }`
    * how to look up records after an index scan `into { indexScan { ... } }`

Syntax:
```kotlin
groupBy { /* return group id*/ } into {
    lookup { /* return unique index on output table */ }
    build { /* return new output record */ }
    indexScan { /* return index on input table */ }
}
```


</TabItem>
<TabItem value="classes">

The `groupBy`-`into` syntax determines:
- how records are grouped `groupBy { ... } `
- how output records are constructed `into { ... }`

Syntax:
```kotlin
groupBy { /* return group id*/ } into { /* return new output record */ }
```
</TabItem>
</Tabs>

### groupBy

The code you put in your `groupBy` block determines the `groupId`. That is important, because the `groupId` determines the level at which records are aggregated. For example, you can set up the code to group by instrument; in this case, the calculation would then aggregate per instrument.

The result of the `groupBy` block can be any kotlin type, as long as it can be used to uniquely identify a grouping. That is, as long as the result has a consistent `equals` method. This includes but is not limited to:

- single fields from the input table:
```kotlin
groupBy { allocationId }
```
- a type safe tuple of input table fields:
```kotlin
groupBy { tuple(allocationId, feeGroup) }
```
- a string concatenation of input table fields:
```kotlin
groupBy { group(allocationId, feeGroup) }
```
- unique index entries on the output table (table only):
```kotlin
groupBy { CommissionAndFeesSummary.ByAllocationId(allocationId, feeGroup) }
```

Consolidations support single or multiple groupings. Multiple groupings are useful when aggregating data by different levels: for example, where you want to calculate trade totals per currency as well as by counterparty.

#### into

The `into` statement is different for standard and object Consolidators:

<Tabs defaultValue="tables" values={[{ label: 'Tables', value: 'tables', }, { label: 'Classes', value: 'classes', }]}>
<TabItem value="tables">

#### lookup

The `lookup` block is optional when grouping by a unique index on the output table. In all other cases, the lookup
should be defined. In this block, you have access to the `input` and `groupId` properties.

Example:
```kotlin
groupBy { tradeId } into {
    lookup { Trade.ById(groupId) }
}
```

#### build

The `build` block is required if the output table has non-null fields without default values.

Example:

```kotlin
groupBy { Trade.ById(tradeId) } into {
    build {
        Trade {
            tradeId = groupId.tradeId
            feeAmount = input.feeAmount ?: 0
        }
    }
}
```

### indexScan

If any of the functions triggers an index scan, the Consolidator needs to know which records are affected. `indexScan` will
tell the Consolidator how to do that. For example:

```kotlin
groupBy { Order.ById(orderid) } into {
    indexScan { Trade.ByOrderId(groupId.orderId) }
}
```

</TabItem>
<TabItem value="classes">

Consolidator objects need to be able to build output objects on demand. There is no need to interact with the
database at this point.

```kotlin
groupBy { orderId } into {
    Order {
        orderId = groupId
    }
}
```
</TabItem>
</Tabs>

### where block (optional)

The `where` block will filter records prior to consolidation. There are two modes for this filter. In the default mode,
the consolidation events will be modified, depending on the predicate. This means that a modify event might appear as
an insert or delete.

example:
```kotlin
where {
    quantity > 1000
}
```

Optionally, the where block takes an `ignore` parameter that will cause it to ignore certain records. Any
records matching the qualifications specified will be completely ignored.

```
where(ignore = true) {
    tradeDate < today()
}
```

### reprocessSchedule block (optional)

Some consolidations might require periodic reprocessing of data. This will trigger a [cold start](/server/consolidator/basics/#the-startprocess-command-cold-start) on a selected range of data.


## Functions

Functions are the base building blocks of the select statement.

All functions except for for `count` require an input. With `count` input is optional. 
For the required input, use the syntax `sum { feeAmount }`.
Within the curly brackets of the function, you can access all fields on the row, and you can use any kotlin operation on the row. The function will be applied over the result, unless the result is null, in which case it will be ignored.

### Function examples

There is a full reference of functions in the [Advanced](/server/consolidator/advanced/) page on Consolidators.

```kotlin
sum { feeAmount }                   // sums the FEE_AMOUNT
sum { feeAmount + otherAmount }     // sums the total of FEE_AMOUNT plus OTHER_AMOUNT
sum { feeAmount ?: otherAmount }    // sum FEE_AMOUNT or OTHER_AMOUNT if FEE_AMOUNT is null
// etc.
```
### Assigning functions to fields

After a function is defined, its output can be directed to an output field. To do this, use the `into` keyword.
Note that functions can only be applied to fields that match in type. For example, you can only assign `Double` value
to a `DOUBLE` field.


<Tabs defaultValue="tables" values={[{ label: 'Tables', value: 'tables', }, { label: 'Classes', value: 'classes', }]}>
<TabItem value="tables">

```kotlin
sum { feeAmount } into FEE_AMOUNT
sum { originalFeeAmount } into ORIGINAL_FEE_AMOUNT
sum { splitFeeAmount } into SPLIT_FEE_AMOUNT
```
</TabItem>
<TabItem value="classes">

```kotlin
sum { feeAmount } into Order::feeAmount
sum { originalFeeAmount } into Order::originalFeeAmount
sum { splitFeeAmount } into Order::splitFeeAmount
```
</TabItem>
</Tabs>

### Transformations on functions

The Consolidator also supports higher-level functions; this is where you can apply a transformation on the function,
before it is assigned.

### onlyIf

Where this is present, the function only applies to rows that meet the condition specified, for example:

```kotlin
sum { feeAmount } onlyIf { feeGroup == FeeGroup.COMMISSION } into TOTAL_COMMISSION
```

### withInitialValue

Some functions support an initial value. Within this context, you can access the first input row, as well as the output
object, for example:

```kotlin
sum { -feeAmount } withInitialValue { output.expectedFees } into OUTSTANDING_FEES
```

### pivotBy

This function can direct a function result across different columns, and change the `into` keyword. Within the `into`
tag, the `pivot` property will contain the value of the value returned in the `pivotBy { ... }` tag.

```kotlin
sum { feeAmount } pivotBy { feeGroup } into {
    when (pivot) {
        FeeGroup.STAMP -> TOTAL_STAMP
        FeeGroup.COMMISSION -> TOTAL_COMMISSION
        FeeGroup.FEE -> TOTAL_FEES
        FeeGroup.LEVY -> TOTAL_LEVY
        FeeGroup.TAX -> TOTAL_TAX
        FeeGroup.OTHER -> TOTAL_OTHER
        FeeGroup.LOCAL -> TOTAL_LOCAL
        FeeGroup.CHARGE -> TOTAL_CHARGE
        FeeGroup.RESEARCH -> TOTAL_RESEARCH
    }
}
```

### Shared function definitions

Function definitions can also be assigned to variables and assigned to multiple outputs, for example:

```kotlin
val feeSum = sum { feeAmount }
feeSum into TOTAL_FEES
feeSum onlyIf { feeGroup == FeeGroup.COMMISSION } into TOTAL_COMMISSION
```

### index scans

Functions can sometimes trigger an index scan. This is when a Consolidator needs to re-read previously consolidated rows
in order to calculate the correct value. 
- For some functions, this is never required: for example, `sum` and `count`.
- For some functions, it is required sometimes: for example, `min` and `max`.
- For some functions, it is always required: for example, `stDev`.


## Starting and killing the process

All Genesis processes can be started or killed using the `startServer` and `killServer` commands. But here's the thing; if the Consolidator process stops for any reason, you should almost certainly perform a cold start when you restart the process. This ensures that any changes to data while the process was not running are properly recalculated before any real-time calculations are triggered.

:::warning
If you simply restart the Consolidator process, then any changes to data that occurred while the process was not running will not be recalculated. Got that? The changed data will not be recalculated.
:::


### The startProcess command (cold start)

A cold start avoids the danger of losing your calculated data. To make a cold start, run the command 

`startProcess GENESIS_CONSOLIDATOR --coldStart`

In this case, the Consolidator process is called `GENESIS_CONSOLIDATOR`. If in doubt, you can find the exact name of your consolidator in the [service-definitions](https://docs.genesis.global/secure/server/configuring-runtime/service-definitions/) file.

This command consolidates all records in the system before starting the real-time event-driven consolidations. 

At the beginning of a cold start, all fields in `consolidationFields` of the consolidation table are zeroed (or deleted, if transient) before initiating the re-consolidation of all the records in the database.

## Troubleshooting

You can set the default logging level for all the Consolidators in your _application_**-consolidator.kts** file using a config statement at the beginning. 
However, within any individual Consolidator, you can also set a logging level that overrides this setting.
If a Consolidator is not functioning as expected, raise its logging level to INFO, or even higher.
Let's see a very simple example. Here the default logging level has been set to INFO. However, Consolidator B has its own loglevel, `DEBUG`, which overrides the file-level setting:

```kotlin
consolidators {
    config {
        logLevel = INFO
    }
    consolidator ("A", ...) {
        ...     
    }
    consolidator ("B", ...) {
        config {
            logLevel = DEBUG
        }
        ...
    }
}
```


