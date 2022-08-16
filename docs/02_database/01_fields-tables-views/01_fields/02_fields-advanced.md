---
title: 'Fields - advanced'
sidebar_label: 'Fields - advanced'
id: fields-advanced
---

[Introduction](/database/fields-tables-views/fields/)  | [Basics](/database/fields-tables-views/fields/fields-basics/) |  [Advanced](/database/fields-tables-views/fields/fields-advanced/) | [Examples](/database/fields-tables-views/fields/fields-examples/) | [Generating DAOs](/database/fields-tables-views/genesisDao/) 

## Modularity

Genesis is modular, so if you have a dependency on another module (e.g. Auth), your project will naturally inherit all the fields from that module and and they are available in your project. 

It makes sense to re-use fields in dependent modules wherever possible; this cuts down your need to define field names that are unique across all modules and the project itself.

## Scripting

GPAL is a scripting language that gives engineers plenty of advantages, especially when it comes to repetition. 

For example, where you need to create a large number of table fields, say `ALGO_PARAM_1` through to `ALGO_PARAM_50`, you can introduce `for` loops:

```kotlin
  val algoParamPrefix = "ALGO_PARAM_"
  for(i in 1..51) {
    field(name = algoParamPrefix + i, type = STRING)
  }
```
