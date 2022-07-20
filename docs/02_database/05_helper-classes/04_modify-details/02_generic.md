---
title: 'Generic'
sidebar_label: 'Generic'
id: generic
---


Generic Modify Details
======================

When performing modify and upsert operations, you must specify the index to use. This identifies the record to modify and the fields to modify. For this, there is the `EntityModifyDetails` class.

-   Kotlin
-   Java

```
val modifyDetails = EntityModifyDetails(trade)// orval modifyDetails = EntityModifyDetails(trade, Trade.ByTypeId)// orval modifyDetails = EntityModifyDetails(trade, Trade.ByTypeId, listOf("TRADE_ID"))
```

[](https://docs.genesis.global/secure/reference/developer/api/database/how-to/helper/write-result/legacy/)