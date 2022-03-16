---
title: 'Defining GPAL Consolidators'
sidebar_label: 'Defining'
sidebar_position: 2
id: cons-gpal1

---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



[Introduction](/creating-applications/defining-your-application/business-logic/consolidators/consolidators/)  | [Where to define](/creating-applications/defining-your-application/business-logic/consolidators/cons-where-to-define/) | [Basics](/creating-applications/defining-your-application/business-logic/consolidators/cons-technical-details/) |  [Advanced](/creating-applications/defining-your-application/business-logic/consolidators/advanced/cons-advanced-technical-details/) | [More examples](/creating-applications/defining-your-application/business-logic/consolidators/cons-more-examples/) | [Configuring runtime](/creating-applications/defining-your-application/business-logic/consolidators/cons-configuring-runtime/) | [Testing](/creating-applications/defining-your-application/business-logic/consolidators/cons-testing/)








## Using Consolidators

Consolidators listen to updates on an underlying database object, either a view or a table. The consolidator aggregate the changes,
and then outputs the aggregated data to a specified type, the output type.

There are two ways to use GPAL consolidators:

- as a service. Here, the output type must always be a table entity. The consolidator service listens to table updates, and updates the target table. 
- as a consolidator object. This can be used in code to perform on-demand consolidations and what-if analysis. The output is not saved in your application's database.

### Consolidator services

:::important

In a multi-node environment, consolidator services should be set to primary only, otherwise the changes will be applied
multiple times.

:::

This is the primary method of using consolidators. The consolidator runs a service and automatically updates the
output table. 

These services can be started in two modes, firstly, by default, they will listen for changes and update
on the basis of that. 

Secondly, they support cold-start. A cold-start will firstly rerun the aggregation over existing
data, before continuing in normal mode. This can be useful to deal with changes in the consolidator definition, or if
there has been a problem aggregating data.

### Consolidator instances

Consolidators are also available as classes to use in code. Used this way, they can be used in custom services as well
as in request servers and event handlers. These can perform on-demand consolidations, where the input can be read
directly from the database, provided at runtime, or a combination.

For example:
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

## Functions

Functions are the base building blocks of the select statement.

The  `count` function is exceptional, in that it can have an input or no input. All other functions require input. 
For the required input, use the syntax `sum { feeAmount }`.
Within the curly brackets of the function, you can access all fields on the row, and you can use any kotlin operation on the row. The function will be applied over the result, unless the result is null, in which case it will be ignored.

### Function examples

For a full reference of functions, please see [here](/creating-applications/defining-your-application/business-logic/consolidators/advanced/cons-gpal2/).

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

The consolidator also supports higher-level functions; this is where you can apply a transformation on the function,
before it is assigned.

#### onlyIf

Where this is present, the function only applies to rows that meet the condition specified, for example:

```kotlin
sum { feeAmount } onlyIf { feeGroup == FeeGroup.COMMISSION } into TOTAL_COMMISSION
```

#### withInitialValue

Some functions support an initial value. Within this context, you can access the first input row, as well as the output
object, for example:

```kotlin
sum { -feeAmount } withInitialValue { output.expectedFees } into OUTSTANDING_FEES
```

#### pivotBy

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

#### Shared function definitions

Function definitions can also be assigned to variables and assigned to multiple outputs, for example:

```kotlin
val feeSum = sum { feeAmount }
feeSum into TOTAL_FEES
feeSum onlyIf { feeGroup == FeeGroup.COMMISSION } into TOTAL_COMMISSION
```

### index scans

Functions can sometimes trigger an index scan. This is when a consolidator needs to re-read previously consolidated rows
in order to calculate the correct value. 
- For some functions, this is never required:for example, `sum` and `count`.
- For some functions, it is required sometimes: for example, `min` and `max`.
- For some functions, it is always required: for example, `stDev`.


## Defining a consolidator
You define a consolidator service in a `consolidator.kts` file. Ijn this file, you need to provide:

- a name
- an input table or view
- an output table

The empty structure below shows the optional and mandatory code blocks in a consolidator file. Comments are included to provide further information:

```kotlin
consolidators {
    config {
        // optional file level configuration
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

### config block (optional)

The config block is available at both the file and consolidator level. File-level configuration will overwrite default
properties, and consolidator properties will overwrite both.

| Property             | Description                                   | Supports Values                    | Default Value |
|----------------------|-----------------------------------------------|------------------------------------|---------------|
| defaultLogLevel      | the default log level for the consolidator    | TRACE, DEBUG, INFO, WARN, ERROR    | TBC           |
| onNotFound           | what to do if an output record is not found   | BUILD, WARN, IGNORE, FAIL, DEFAULT | TBC           |
| batchingPeriod       | the time in ms before writing to the database |                                    | TBC           |
| ignoreIndexScan      | disables index scans                          |                                    | TBC           |
| defaultErrorHandling | what to do if an exception is thrown          | IGNORE, WARN, FAIL                 | TBC           |

### select block

In the select block the developer can specify functions and outputs, for example:


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

#### logging
For debugging purposes, the `select` block also supports logging. By default, the consolidator logs all events with debug level TBC, but this can be overwritten with custom messages. To do this, use the `logJoin`,
`logLeave` and `logNoop` blocks:

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

There are significant differences in the `groupBy` syntax, depending on whether we are consolidating into a table or into
a class. Table syntax is more complex, as records need to be loaded and created. Also, the table syntax supports
index scans, which need to be configured.

<Tabs defaultValue="tables" values={[{ label: 'Tables', value: 'tables', }, { label: 'Classes', value: 'classes', }]}>
<TabItem value="tables">

The `groupBy`-`into` syntax determines:
- how records are grouped `groupBy { ... } `
- how the consolidator interacts with the database `into { ... }`
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

#### groupBy

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

The into statement is different for table and class consolidators:

<Tabs defaultValue="tables" values={[{ label: 'Tables', value: 'tables', }, { label: 'Classes', value: 'classes', }]}>
<TabItem value="tables">

##### lookup

The `lookup` block is optional when grouping by a unique index on the output table. In all other cases, the lookup
should be defined. In this block, the developer has access to the `input` and `groupId` properties.

Example:
```kotlin
groupBy { tradeId } into {
    lookup { Trade.ById(groupId) }
}
```

##### build

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

##### indexScan

If any of the functions triggers an index scan, the consolidator needs to know the affected records. `indexScan` will
tell the consolidator how to do that. For example:

```kotlin
groupBy { Order.ById(orderid) } into {
    indexScan { Trade.ByOrderId(groupId.orderId) }
}
```

</TabItem>
<TabItem value="classes">

Class consolidators simply need to be able to build output objects on demand. There is no need to interact with the
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

Some consolidations might require periodic reprocessing of data. This will trigger a cold start on a selected range
of data.


## Troubleshooting

To help developers troubleshoot consolidator issues, consolidators will progress data to the logfile when the service
log level is set to debug or trace. Furthermore, specific operations can be debugged by using the provided `LOG`
property in the consolidator. This is available in all contexts of the consolidator.