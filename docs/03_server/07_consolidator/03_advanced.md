---
title: 'Consolidator - advanced'
sidebar_label: 'Advanced'
id: advanced
keywords: [server, consolidator, advanced]
tags:
  - server
  - consolidator
  - consolidator group
  - advanced
---

## Consolidator groups
Consolidator groups are essential if you are using a non-transaction database (such as Aerospike).

`groupName` identifies a group of Consolidators. 

```kotlin
groupName = "_name_"
```

If you include this statement in your `consolidator` block, then the Consolidator will belong to the named group.

In a non-transaction database (for example, Aerospike), a group is designed to offer consistent consolidation in the absence of ACID guarantees at the database level. Consolidators in the same group will not interfere with each other's calculations as they update - particularly where they output to the same table. 

:::note 
This is limited to Consolidator updates within a group in a single process. Updates in other groups, other processes or other nodes could still interfere. You must plan this carefully.
:::

Below is an example where we have declared two `consolidator` blocks. Each has `groupName = "ORDER"`, so they are in the same group. The two `consolidator`blocks handle different types of order - but they are aggregated into the same three output tables: `TOTAL_NOTIONAL`, `TOTAL_QUANTITY` and `TRADE_COUNT`.


```kotlin
    consolidator(SWAP_ORDERS, ORDER_SUMMARY) {
        config {
            groupName = "ORDER"
        }
        
        select {
            ORDER_SUMMARY {
                sum { totalNotional } into TOTAL_NOTIONAL
                sum { totalQuantity } into TOTAL_QUANTITY
                sum { tradeCount } into TRADE_COUNT
            }
        }
​
        groupBy { OrderSummary.byGroupId("${orderDate.year}-${orderDate.monthOfYear}") }
    }
    consolidator(FX_ORDERS, ORDER_SUMMARY) {
        config {
            groupName = "ORDER"
        }
        
        select {
            ORDER_SUMMARY {
                sum { totalNotional } into TOTAL_NOTIONAL
                sum { totalQuantity } into TOTAL_QUANTITY
                sum { tradeCount } into TRADE_COUNT
            }
        }
​
        groupBy { OrderSummary.byGroupId("${orderDate.year}-${orderDate.monthOfYear}") }
    }
```	

## Select statement: standard functions

In this section, we look in more detail at the functions that are the building blocks of the select statement in a `Consolidator` specification.

With one exception, all functions require input. 

The exception is `count`, which can either have an input or no input.

The syntax for an input to a GPAL function is `sum { feeAmount }`

Within the curly brackets of the function, you can access all the fields on a row, and you can use any Kotlin operation on the row. The function will be applied over the result, unless the result is null, in which case it will be ignored.


| Function      | Description                               | Input      | Output        | Index Scan    |
|:--------------|-------------------------------------------|------------|---------------|---------------|
| sum           | sums values in the value field            | any number | same as input | never         |
| count         | counts all records                        | -          | INTEGER       | never         |
|               | counts records that have a value          | anything   | INTEGER       | never         |
| countDistinct | counts distinct value values              | anything   | INTEGER       | always        |
| countBig      | counts all records                        | -          | LONG          | never         |
|               | counts records that have a value          | any value  | LONG          | never         |
| avg           | average value                             | any number | same as input | always        |
| min           | minimum value                             | any number | same as input | sometimes `*` |
| max           | maximum value                             | any number | same as input | sometimes `*` |
| stdev         | standard deviation for value              | any number | DOUBLE        | always        |
| stdevp        | population standard deviation for value   | any number | DOUBLE        | always        |
| variance      | statistical variance for value            | any number | DOUBLE        | always        |
| variancep     | population statistical variance for value | any number | DOUBLE        | always        |
| stringAgg     | string concatenation                      | any string | STRING        | sometimes `+` |
| checksum      | calculates a hash over the input          | any value  | LONG          | always        |

`*` if previous min or max value is removed<br />
`+` if previous any value is changed

### Examples



```kotlin
sum { feeAmount }                   // sums the FEE_AMOUNT
sum { feeAmount + otherAmount }     // sums the total of FEE_AMOUNT plus OTHER_AMOUNT
sum { feeAmount ?: otherAmount }    // sum FEE_AMOUNT or OTHER_AMOUNT if FEE_AMOUNT is null
count ()                            // counts the number of records
count { feeAmount }                 // counts the records with a FEE_AMOUNT
// etc.
```


## Custom functions

Consolidators also support custom functions that allow you to specify behaviour for join, leave and noop
operations. 

There are two parts to defining a custom functions:

1. Select an input.
2. Define the consolidation.


After the custom function has been defined, it supports the same syntax as other functions, including `into`, `pivotBy`,
etc.

In the example below, the `sum` function is defined as a custom function. It uses `feeAmount` as the input, and applies three operations:

```kotlin
using { feeAmount } withOperations {
    onJoin { previousValue + input }
    onLeave { previousValue - input }
    onNoop { previousValue + newInput - oldInput }
} into value
```

### usingRow

There are two types of input for custom functions: 

- `using` takes an input from a row, like any other function. The return type determines the type of the function.
- `usingRow` takes the whole row as input. The type of function must be specified. 

The function in the example above can also be implemented with `usingRow`, as shown below:

```kotlin
usingRow(DOUBLE) withOperations {
    onJoin { previousValue + input.feeAmount.orZero() }
    onLeave { previousValue - input.feeAmount.orZero() }
    onNoop { previousValue + newInput.feeAmount.orZero() - oldInput.feeAmount.orZero() }
} into value
```


This shows the benefit of `using`, as it handles `null` values. The `orZero()` call takes any nullable number and returns the value or `0` if it is null.

### withOperations

This block enables you to specify the behaviour of the different consolidation operations (including the previous example). 

In that example:

- a join is when a row is added to the consolidation group
- a leave is when a record leaves the consolidation group
- a noop is when a record is modified while staying in the same consolidation group: for example, if a price or a fee is changed

Each operation has access to the operation context as follows:

- `onJoin`
    1. `previousValue`
    2. `input`
- `onLeave`
    1. `previousValue`
    2. `input`
- `onNoop`
    1. `previousValue`
    2. `newInput`
    3. `oldInput`

### withAggregation

You can use this function for a number of requirements:

- where the function needs to consider all values, rather than just one at time 
- where you require a different function outcome, other than update value 
- where no update at all is required
- where the group id should be reconsolidated

For this function:

- The `input` variable holds a `List` of aggregation events.
- The `previousValue` holds the previous value. 
- the `sum` function uses `withAggregation`

`input` contains only `Join`, `Leave` and `Noop` values. (You can see how these are accessed in the example below.)

All `withAggregation` functions must end with an `asUpdate()` call. This effectively says, use the value you now have. 

The example below uses the Kotlin function `fold` to calculate the value `acc`, which is the aggregated value for a group, such as total fees.


```kotlin
using { feeAmount } withAggregation {
    input.fold(previousValue) { acc, value ->
        when (value) {
            is Join -> acc + value.value
            is Leave -> acc - value.value
            is Noop -> acc + value.new - value.old
        }
    }.asUpdate()
}
```

`withAggregation` also supports two other return values:

- `Noop` causes the function to ignore the input for this particular field, and there is no change written to the database. For example, this is used during an iterative comparison to find a maximum value. The function compares the next value with the previous; if it is not higher, then return `Noop`. 
- `IndexScan` causes the function to re-evaluate every database value for that key. For example, if the record with the maximum value has been deleted from the database, go to the database and find the new maximum value.
