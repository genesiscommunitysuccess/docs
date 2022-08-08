---
title: 'Generic'
sidebar_label: 'Generic'
id: generic
---


Generic modify details
======================

When performing modify and upsert operations, you must specify the index to use. This identifies the record to modify and the fields to modify. For this, there is the `EntityModifyDetails` class.

-   Kotlin
-   Java

```
val modifyDetails = EntityModifyDetails(trade)// orval modifyDetails = EntityModifyDetails(trade, Trade.ByTypeId)// orval modifyDetails = EntityModifyDetails(trade, Trade.ByTypeId, listOf("TRADE_ID"))
```
