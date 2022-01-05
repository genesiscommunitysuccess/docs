---
title: 'GPAL Consolidator Functions'
sidebar_label: 'GPAL Functions'
sidebar_position: 95
id: gpal-functions
---

## Standard functions

Functions `count` can have an input or no input, all other functions require input. When a function requires input,
use the following syntax `sum { feeAmount }`, Within the curly braces of the function, you can access all fields on the
row, and you can use any kotlin operation on the row. The function will be applied over the result, unless the result is
null, in which case it will be ignored.


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
| stringAgg     | string concatenation                      | any value  | STRING        | sometimes `+` |
| checksum      | calculates a hash over the input          | any value  | LONG          | always        |

`*` if previous min or max value is removed<br />
`+` if previous any value is changed

### Example

### some function examples

```kotlin
sum { feeAmount }                   // sums the FEE_AMOUNT
sum { feeAmount + otherAmount }     // sums the total of FEE_AMOUNT plus OTHER_AMOUNT
sum { feeAmount ?: otherAmount }    // sum FEE_AMOUNT or OTHER_AMOUNT if FEE_AMOUNT is null

count ()                            // counts the number of records
count { feeAmount }                 // counts the records with a FEE_AMOUNT
// etc.
```


## Custom Functions

Consolidators also support custom functions that allow developers to specify behaviour for the join, leave and noop
operations. There are two parts to defining a custom functions, first an input must be selected, next the consolidation
must be defined.

After the custom function has been defined it supports the same syntax as other functions, including `into`, `pivotBy`,
etc.

### using

For example, the sum function could be defined as a custom function as per below. Using `feeAmount` as the input, and
the following operations:
```kotlin
using { feeAmount } withOperations {
    onJoin { previousValue + input }
    onLeave { previousValue - input }
    onNoop { previousValue + newInput - oldInput }
} into value
```

### usingRow

There are types of inputs for custom functions: `using` and `usingRow`. `using` will take an input from a row like
any other function, whereas `usingRow` will take the whole row as input. With `using` the return type will determine
the type of the function, with `usingRow` the type will have to be specified. The function above can also be implemented
with `usingRow` as below:

```koltin
usingRow(DOUBLE) withOperations {
    onJoin { previousValue + input.feeAmount.orZero() }
    onLeave { previousValue - input.feeAmount.orZero() }
    onNoop { previousValue + newInput.feeAmount.orZero() - oldInput.feeAmount.orZero() }
} into value
```


This shows the benefit of `using`, as it will handle `null` values. The `orZero()` call will take any nullable number
and return the value or `0` if it is null.

### withOperations

The above use `withOperations`, this block allows developers to specify the behaviour on the different consolidation
operations. There three, join, leave, and noop. A join is when a row is added to the consolidation group, a leave is
when a record leaves the consolidation group, and a noop is when a record is modified while staying in the same
consolidation group. Each operation has access to the operation context as follows:

1. `onJoin`
    1. `previousValue`
    2. `input`
1. `onLeave`
    1. `previousValue`
    2. `input`
1. `onNoop`
    1. `previousValue`
    2. `newInput`
    2. `oldInput`

### withAggregation

Some functions need to consider all values, rather than just one at time. For this use case consolidators support
`withAggregation`. Alternatively, sometimes a developer might want to have a different function outcome, other than
update value. Sometimes there should be no update at all. Alternatively, sometimes the group id should be
reconsolidated. `withAggregation` exposes all of these advanced consolidation features.

When using this way of calculating custom functions, the `input` variable holds a `List` of aggregation events, and
the `previousValue` holds the previous value. `input` contains only `Join`, `Leave` and `Noop` values, which can
be accessed as per the example below.

Again, the sum function using `withAggregation`.

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

The `asUpdate()` call at the end is required, as `withAggregation` also supports additional return values of `Noop` and
`IndexScan`. The `Noop` value will cause the function to ignore the input for this particular field, and there will
be no change written to the database. Conversely, returning `IndexScan` will cause the consolidator to re-evaluate
every database value for that key.

Examples of the above use could be the `max` function. If the new maximum value is less than the current maximum, then
no data needs to be written to the database. However, if the current maximum value leaves the consolidator group, then
all values should be evaluated to determine the new maximum value.
