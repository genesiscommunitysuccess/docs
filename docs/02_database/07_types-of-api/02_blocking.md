---
title: 'Types of API - SyncEntityDb'
sidebar_label: 'SyncEntityDb'
id: blocking
keywords: [ database, types of api, api, types, sync, blocking ]
tags:
  - database
  - types of api
  - api
  - types
  - sync
  - blocking
---

The blocking - or sync - API is the simplest API for accessing the Genesis database.

## Return values

Get operations in this API are nullable. When getting a record, you must check if it is null:

```kotlin
val trade: Trade? = db.get(Trade.byId("TRADE_1"))
if (trade == null) throw RuntimeException("Unable to find trade")
```

Write operations return either a single return object, or a list of result objects, for the `...All` operations,
e.g. `updateAll`. These are never nullable.

```kotlin
val insert: InsertResult<Trade> = db.insert(trade)
val inserts: List<InsertResult<Trade>> = db.insertAll(myTrades)
```

`getRange` and `getBulk` operations a `List<X>`: 

```kotlin
val trades: List<Trade> = db.getBulk(TRADE)
```

Note that this will load the entire table into memory. This is fine for smaller tables and ranges. However, for
large tables and ranges, the `stream()` function is provided on the database. This will create a `Stream` that streams the data, rather than loading it all in memory:

```kotlin
val trades: Stream<Trade> = db.stream().getBulk(TRADE)
try {
    // use the stream here
} finally {
    trades.close()
}
```

While this is more memory-efficient, the database connection will be kept open until the stream is closed. As in the above example, always close the stream. Not closing these streams will lead to your application running out of database connections.
