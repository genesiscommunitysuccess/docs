---
title: Basics
sidebar_label: Basics
id: cons-technical-details
sidebar_position: 3

---


[Introduction](/creating-applications/defining-your-application/business-logic/consolidators/consolidators/)  | [Where to define](/creating-applications/defining-your-application/business-logic/consolidators/cons-where-to-define/) | [Basics](/creating-applications/defining-your-application/business-logic/consolidators/cons-technical-details/) |  [Advanced](/creating-applications/defining-your-application/business-logic/consolidators/advanced/cons-advanced-technical-details/) | [More examples](/creating-applications/defining-your-application/business-logic/consolidators/cons-more-examples/) | [Configuring runtime](/creating-applications/defining-your-application/business-logic/consolidators/cons-configuring-runtime/) | [Testing](/creating-applications/defining-your-application/business-logic/consolidators/cons-testing/)

## A very simple consolidator
Within your **_application_-consolidator.xml**, you can define as many consolidators as you like. Each one is a `<consolidation>` block of code that performs a calculation or aggregation.

Here is an example of a very simple consolidator file that has just one single simple consolidator. 

```xml
<consolidations>
    <consolidation name="SIMPLE_CALC" start="false" group="ORDER">
// Substance needed!!!
    </consolidation>
</consolidations>   

```

### Syntax for the definitions

Each consolidator definition is a code block that can contain the following elements:


* **name** to identify the consolidation block.

* **start** which can be set to true or false and will enable or disable the consolidation on startup.

* **group** is optional and causes consolidations to be thread-safe between each other. This is useful to make sure numbers are correct if you need records to be consolidated based on different root tables. For example, TRADE -> ORDER and ORDER -> ORDER consolidations should be in the the same group.

* **tables** which are the table joins used to get the data, in a similar way to the dataserver. A table has a name, and an alias used to bind the results of queries to variables and, optionally, the list of field names that will be used for numeric calculations in the node (`consolidationFields` attribute). 
* If you don't define a `consolidationFields` attribute, the consolidation manager will attempt to set all numeric values to **0** for each consolidation to avoid any potential null pointer exceptions (not efficient with large tables). Backward joins are also supported (only one per consolidation).

* **groupBy** represents the unique `group` key to define where each event belongs. This is a Groovy expression that needs to return a string, and all the aliases from `<tables>` are available as bindings. For convenience, there is a helper method called "group", that accepts multiple input values and concatenates them using the "|" symbol.

IMPORTANT: Do not supply null values to the group method. If you are using a nullable field,  use the elvis operator: 

```kotlin
group(trade.getString("DEAL_ID") ?: "NULL")
```
 
* **consolidateTable** which represents the table in which the consolidation rows are fetched and modified. They have a name and an alias which will be used to reference this record in the `<calculation>` and `<consolidationTarget>` nodes. They can also be set as transient or non-transient (the default). consolidationFields attribute is also (optionally) present in this table.

* **consolidateTarget** which contains the join expression used to fetch the "consolidated" row relative to this specific consolidation event using the key defined in the "key" attribute. If the consolidation record is not found, it will be created with all numeric fields zeroed representing an initial row. Additionally, the computed string in the `groupBy` Groovy expression is available as a binding called `groupId`.

* **calculation** is groovy code where the actual computation of the consolidation is performed.

## Starting and killing the process

All Genesis processes can be started or killed using the `startServer` and `killServer` commands. But here's the thing. If you turn off the consolidator process for any reason, you should almost certainly perform a cold start when you restart the process. This ensures that any changes to data while the process was not running are properly recalculated before any real-time calculations are triggered.

:::warning
If you simply restart the consolidator process, then any changes to data that occurred while the process was not running will not be recalculated. Got that? The changed data will not be recalculated.
:::


### The **startProcess** command (cold start)

A cold start avoids the danger of losing your calculated data. To make a cold start, run the command 

`startProcess --coldStart`

This  consolidates all records in the system before starting the real-time event-driven consolidations. 

At the beginning of a cold start, all fields in `consolidationFields` of the consolidation table are zeroed (or deleted, if transient) before initiating the re-consolidation of all the records in the database.



