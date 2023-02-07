---
title: 'Tables'
id: tables
---

# Tables

Tables of data will be critical to your application, from simple tables of currencies or locations to more complex ones that contain trade or order information (for example).

An auto-generated `Models.kt` file is included with your GPALX application. You can use this file to specify all the tables you need for your data model.

Sample table definition:

```kotlin
package global.genesis.alpha.model

import global.genesis.gpl.api.schema.Persist
import global.genesis.gpl.api.schema.Table

@Persist
object TRADE : Table(11_000) {
    val tradeId by varchar().nonNullable().generated()
    val instrumentId by varchar().nonNullable()
    val side by enum(Side.BUY)
    val price by double().nonNullable()
    val quantity by integer().nonNullable()
    val tradeDateTime by now().immutable()
    val enteredBy by username().immutable()
    val modifyTime by now()
    val tradeStatus by enum(TradeStatus.NEW)

    override val primaryKey by primaryKey(tradeId)
}

enum class Side { BUY, SELL }
enum class TradeStatus { NEW, ALLOCATED, CANCELLED }
```
