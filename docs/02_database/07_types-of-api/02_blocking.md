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

The blocking - or sync - API is the simplest API to access the genesis database to use.

## Return values

Get operations in this API are nullable. When getting a record, we should check if it is null

```kotlin
val trade: Trade? = db.get(Trade.byId("TRADE_1"))
if (trade == null) throw RuntimeException("Unable to find trade")
```

Write operations return either a single return object, or a list of result object, for the `...All` operations,
e.g. `updateAll`. These are never nullable.

```kotlin
val insert: InsertResult<Trade> = db.insert(trade)
val inserts: List<InsertResult<Trade>> = db.insertAll(myTrades)
```

`getRange` and `getBulk` operations a `List<X>`: 

```kotlin
val trades: List<Trade> = db.getBulk(TRADE)
```

Please note that this will load the entire table into memory, which is fine for smaller table and ranges, however, for
large tables and ranges the `stream()` function is provided on the database. This will create a `Stream` that will 
stream the data, rather than load it all in memory:

```kotlin
val trades: Stream<Trade> = db.stream().getBulk(TRADE)
try {
    // use the stream here
} finally {
    trades.close()
}
```

Please note that while this is more memory efficient, the database connection will be kept open until the stream 
is closed. As in the above example, always close the stream. Not closing these streams will lead to your application
running out of database connections.
