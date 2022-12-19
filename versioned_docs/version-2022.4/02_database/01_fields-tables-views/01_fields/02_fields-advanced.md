---
title: 'Fields - advanced'
sidebar_label: 'Fields - advanced'
id: fields-advanced
keywords: [database, fields, advanced]
tags:
    - database
    - fields
    - advanced
---



## Modularity

Genesis is modular, so if you have a dependency on another module (e.g. Auth), your project will naturally inherit all the fields from that module and and they are available in your project. 

It makes sense to re-use fields in dependent modules wherever possible; this cuts down your need to define field names that are unique across all modules and the project itself.

## Scripting

[GPAL](../../../../getting-started/glossary/glossary/#gpal) is a scripting language that gives engineers plenty of advantages, especially when it comes to repetition. 

For example, where you need to create a large number of table fields, say `ALGO_PARAM_1` through to `ALGO_PARAM_50`, you can introduce `for` loops:

```kotlin
  val algoParamPrefix = "ALGO_PARAM_"
  for(i in 1..51) {
    field(name = algoParamPrefix + i, type = STRING)
  }
```
