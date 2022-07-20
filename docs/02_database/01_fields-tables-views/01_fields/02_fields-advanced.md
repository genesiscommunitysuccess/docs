---
title: 'Fields - advanced'
sidebar_label: 'Fields - advanced'
id: fields-advanced
---

## Modularity

Genesis is modular, so if you have a dependency on another module (e.g. AUTH), your project will naturally inherit all the fields from that module and have them available in the project. 

So, you should ensure you re-use fields available in dependent modules if at all possible; otherwise, you must define field names that are unique across all modules and the project itself.

## Scripting

GPAL is a scripting language that gives engineers plenty of advantages, especially when it comes to repetition. 

For example, where you need to create a large number of table fields, say `ALGO_PARAM_1` through to `ALGO_PARAM_50`, you can introduce `for` loops:

```kotlin
  val algoParamPrefix = "ALGO_PARAM_"
  for(i in 1..51) {
    field(name = algoParamPrefix + i, type = STRING)
  }
```
