---
title: 'Advanced'
sidebar_label: 'Advanced'
id: advanced
---

[Introduction](/server/consolidator/introduction) | [Basics](/server/consolidator/basics) |  [Advanced](/server/consolidator/advanced) | [Examples](/server/consolidator/examples) | [Configuring runtime](/server/consolidator/configuring-runtime) | [Testing](/server/consolidator/testing)

In this page, we look in more detail at the functions that are the building blocks of the select statement in a `consolidator` specification.

## Standard functions

With one exception, all functions require input. 

The exception is `count`, which can either have an input or no input.

The syntax for an input to a GPAL function is `sum { feeAmount }`

Within the curly brackets of the function, you can access all the fields on a row, and you can use any kotlin operation on the row. The function will be applied over the result, unless the result is null, in which case it will be ignored.


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

Consolidators also support custom functions that allow you to specify behaviour for  join, leave and noop
operations. 

There are two parts to defining a custom functions:

1. Select an input.
2. Define the consolidation.


After the custom function has been defined, it supports the same syntax as other functions, including `into`, `pivotBy`,
etc.

### using

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

- `using` and `usingRow`. `using` will take an input from a row, like any other function. The return type determines the type of the function.
- `usingRow` will take the whole row as input. The type of function must be specified. 

The function in the example above can also be implemented with `usingRow`, as shown below:

```koltin
usingRow(DOUBLE) withOperations {
    onJoin { previousValue + input.feeAmount.orZero() }
    onLeave { previousValue - input.feeAmount.orZero() }
    onNoop { previousValue + newInput.feeAmount.orZero() - oldInput.feeAmount.orZero() }
} into value
```


This shows the benefit of `using`, as it handles `null` values. The `orZero()` call will take any nullable number and return the value or `0` if it is null.

### withOperations

This block enables you to specify the behaviour of the different consolidation operations (including the previous example). 

In that example:

- a join is when a row is added to the consolidation group
- a leave is when a record leaves the consolidation group
- a noop is when a record is modified while staying in the same consolidation group

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
    2. `oldInput`

### withAggregation

This function has a number of different uses:

- where the function needs to consider all values, rather than just one at time 
- where you require a different function outcome, other than update value 
- where no update at all is required
- where the group id should be reconsolidated

When using this way of calculating custom functions, the `input` variable holds a `List` of aggregation events, and
the `previousValue` holds the previous value. `input` contains only `Join`, `Leave` and `Noop` values, which can
be accessed as per the example below.

Again, the `sum` function uses `withAggregation`.

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

In that example, the `asUpdate()` call at the end is required, as `withAggregation` also supports additional return values of `Noop` and
`IndexScan`. The `Noop` value will cause the function to ignore the input for this particular field, and there will
be no change written to the database. Conversely, returning `IndexScan` will cause the Consolidator to re-evaluate every database value for that key.

A similar example to the above would be to use the `max` function. 
- If the new maximum value is less than the current maximum, then no data needs to be written to the database.
- If the current maximum value leaves the `consolidator` group, then all values should be evaluated to determine the new maximum value.
