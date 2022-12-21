---
title: 'Database interface - RxDb'
sidebar_label: 'RxDb'
id: rxdb
keywords: [database, database interface, rxdb]
tags:
    - database
    - database interface
    - rxdb
---

[Introduction](../../../database/database-interface/database-interface/)  | [EntityDb](../../../database/database-interface/entity-db/) |  [Generated repositories](../../../database/database-interface/generated-repositories/) | [RxDb](../../../database/database-interface/rxdb/) 

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::warning

Using `RxDb` instead of [entityDb](../../../database/database-interface/entity-db/) or [generated repositories](../../../database/database-interface/generated-repositories/) will circumvent compile-time validation of database interactions. This means that errors might not appear until runtime or might lead to unexpected results.

:::

The `RxDb` enables you to interact with the database layer, but you do not have any level of type-safety when doing so, as it uses [DbRecord](../../../database/data-types/dbrecord/). 

The interface supports the same operations as the generated repositories, but will accept any entity represented as `DbRecord`. It supports read and write operations for tables only.

The `RxDb` can be injected in Kotlin and Java using `RxDb`.

|                                                                                                 | [RxDb](../../../database/database-interface/rxdb/)                                                                                      |
|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| [Supports tables](../../../database/fields-tables-views/tables/tables-basics/)                          | ✔️                                                                                                                              |
| [Supports views](../../../database/fields-tables-views/views/views-basics/)                             | ❌️                                                                                                                              |
| Supports any data type                                                                          | ✔️                                                                                                                              |
| Class to import                                                                                 | `RxDb`                                                                                                                          |
| Type-safe read and write                                                                        | ❌️                                                                                                                              |
| Type-safe write result                                                                          | ❌️                                                                                                                              |
| Returns data as                                                                                 | [RxJava return type](../../../database/types-of-api/rxjava/#rxjava-return-types) of [DbRecord](../../../database/data-types/dbrecord/) entities |
| Writes data as                                                                                  | [DbRecord](../../../database/data-types/dbrecord/) entities                                                                             |
| References indexes as                                                                           | Strings                                                                                                                         |
| Programming interface                                                                           | [RxJava](../../../database/types-of-api/rxjava/)                                                                                        |
| Write (input)                                                                                   | [Modify Details](../../../database/helper-classes/modify-details/#entity-modify-details)                                                |
| Write (output)                                                                                  | [Write Result](../../../database/helper-classes/write-result/#entity-write-result)                                                      |
| Subscribe                                                                                       | [Record Update](../../../database/helper-classes/subscription/record-update/) of entity                                                 |
| Bulk or Range Subscribe                                                                         | [Flowable](../../../database/types-of-api/rxjava/#flowable) of [Bulk](../../../database/helper-classes/subscription/bulk/) of entity            |
| Available in [Custom Event Handlers](../../../database/api-reference/event-handler-api/)         | ✔️                                                                                                                              |
| Available in [Custom Request Servers](../../../server/request-server/advanced/#custom-request-servers) | ❌️                                                                                                                              |

## Read operations

### get

Get is a simple lookup on the database; it will return a single entity if a match is found, or no records if none is
found.

The following overloads exist for get; fields is a `Set<String>`.

* `get(DbRecord, U, fields) : Maybe<DbRecord>`
* `get(DbRecord, U) : Maybe<DbRecord>`

#### Syntax

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// we can look up trades by passing in just an index, this will load all the fields:
val findRec = DbRecord("TRADE")
findRec.setString("ID", "00001")
val trade = rxDb.get(findRec, "TRADE_BY_ID")

// or we can provide which fields we are looking for, by passing in a set:
val fields = setOf("ID", "CLIENT_ID")
val trade =  rxDb.get(findRec, "TRADE_BY_ID", fields)
```

</TabItem>
<TabItem value="java">

```java
// we can look up trades by passing in just an index, this will load all the fields:
DbRecord findRec = new DbRecord("TRADE");
findRec.setString("ID", "00001");
Maybe<DbRecord> trade = rxDb.get(findRec, "TRADE_BY_ID");

// or we can provide which fields we are looking for, by passing in a set:
Set<String> fields = Set.of("ID", "CLIENT_ID");
Maybe<DbRecord> trade = rxDb.get(findRec, "TRADE_BY_ID", fields);
```

</TabItem>
</Tabs>

### getAll

Get all will take multiple DbRecords and return a single containing a map of the `RecordMapSearchDetails.mapAlias` to a record if found. 
It takes a `List<RecordMapSearchDetails>` or `Flowable<RecordMapSearchDetails>`, where the `RecordMapSearchDetails` is an entity created to contain:

* The search `DbRecord`
* The index name as a `String`
* The alias for the search, to use to label the result for this query, as a `String`
* The fields to be returned, as a `Set<String>` entity. If null, every field is returned.

#### Overloads

* `getAll(requestDetails: Flowable<RecordMapSearchDetails>): Single<Map<String, DbRecord?>>`
* `getAll(requestDetails: List<RecordMapSearchDetails>): Single<Map<String, DbRecord?>>`

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val findKey = "TRADE_BY_ID"

val record1 = DbRecord("TRADE")
record1.setString("ID", "00001")

val details1: RecordMapSearchDetails = RecordMapSearchDetails.newInstance(record1, findKey, "FirstTrade")

val rec2 = DbRecord("TRADE")
rec2.setString("ID", "Trade2")

val details2: RecordMapSearchDetails = RecordMapSearchDetails.newInstance(rec2, findKey, "SecondTrade")

val resultsMapFromList = rxDb.getAll(listOf(details1, details2))
val resultsMapFromFlowable = rxDb.getAll(Flowable.just(details1, details2))
```

</TabItem>
<TabItem value="java">

```java
String findKey = "TRADE_BY_ID";

DbRecord record1 = new DbRecord("TRADE");
record1.setString("ID", "00001");

RecordMapSearchDetails details1 = RecordMapSearchDetails.newInstance(record1, findKey, "FirstTrade");

DbRecord rec2 = new DbRecord("TRADE");
rec2.setString("ID", "Trade2");

RecordMapSearchDetails details2 = RecordMapSearchDetails.newInstance(rec2, findKey, "SecondTrade");

Single<Map<String, DbRecord>> resultsMapFromList = getRxDb().getAll(List.of(details1, details2));
Single<Map<String, DbRecord>> resultsMapFromFlowable = getRxDb().getAll(Flowable.just(details1, details2));
```

</TabItem>
</Tabs>

### getAllAsList

This operation is similar to the one above, but will return a `List<DbRecord?>`. The results are returned in the order they were requested and will be `null` if no record was found. 
The result list is guaranteed to be the same count as the input.

#### Overloads

* `getAllAsList(requestDetails: Flowable<RecordListSearchDetails>): Single<List<DbRecord?>>`
* `getAllAsList(requestDetails: List<RecordListSearchDetails>): Single<List<DbRecord?>>`

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val findKey = "TRADE_BY_ID"
val record1 = DbRecord("TRADE")
record1.setString("ID", "00001")

val details1 = RecordMapSearchDetails.newInstance(record1, findKey, "FirstTrade")

val rec2 = DbRecord("TRADE")
rec2.setString("ID", "00002")

val details2 = RecordMapSearchDetails.newInstance(rec2, findKey, "SecondTrade")

// Get by providing list
val resultsMapFromList = rxDb.getAllAsList(listOf(details1, details2))

// Get by providing flowable
val resultsMapFromFlowable = rxDb.getAllAsList(Flowable.just(details1, details2))
```

</TabItem>
<TabItem value="java">

```java
String findKey = "TRADE_BY_ID";

DbRecord record1 = new DbRecord("TRADE");
        record1.setString("ID", "00001");

RecordMapSearchDetails details1 = RecordMapSearchDetails.newInstance(record1, findKey, "FirstTrade");

DbRecord rec2 = new DbRecord("TRADE");
        rec2.setString("ID", "00002");

RecordMapSearchDetails details2 = RecordMapSearchDetails.newInstance(rec2, findKey, "SecondTrade");

// Get by providing list
Single<Map<String, DbRecord>> resultsMapFromList = getRxDb().getAll(List.of(details1, details2));

// Get by providing flowable
Single<Map<String, DbRecord>> resultsMapFromFlowable = getRxDb().getAll(Flowable.just(details1, details2));
```

</TabItem>
</Tabs>

### getBulk

This will create a `Flowable` of the whole table. If the database layer supports it, these will be sorted in ascending order by the index provided, or by the primary key if none is provided. 
There is also the `getBulkFromEnd` function, which will return records in descending order. There are also a number of continuation operations, which will return the whole table after the provided record.

#### Overloads

* `getBulk(table: String): Flowable<DbRecord>`
* `getBulk(table: String, index: String? ): Flowable<DbRecord>`
* `getBulk(table: String, fields: Set<String>): Flowable<DbRecord>`
* `getBulk(table: String, index: String?, fields: Set<String>): Flowable<DbRecord>`
* `getBulk(table: String, index: String?, record: DbRecord?): Flowable<DbRecord>` (continuation) (Deprecated)
* `getBulk(table: String, index: String?, record: DbRecord?, fields: Set<String>): Flowable<DbRecord>` (continuation) (Deprecated)

#### Syntax

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// we can pass in the table name, to get it sorted by primary key
val tradeByPrimaryKeyEveryField = rxDb.getBulk("TRADE")
// or with an index name to get it sorted by that
val tradeByIDEveryField = rxDb.getBulk("TRADE", "TRADE_BY_ID")
// or with a set of fields to select
val tradeByPrimaryKeyIDAndPrice = rxDb.getBulk("TRADE", setOf("ID", "PRICE"))
// or both!
val tradeByIDIDAndPrice = rxDb.getBulk("TRADE", "TRADE_BY_ID", setOf("ID", "PRICE"))
```

</TabItem>
<TabItem value="java">

```java
// we can pass in the table name, to get it sorted by primary key
Flowable<DbRecord> tradeByPrimaryKeyEveryField = rxDb.getBulk("TRADE");
// or with an index name to get it sorted by that
Flowable<DbRecord> tradeByIDEveryField = rxDb.getBulk("TRADE", "TRADE_BY_ID");
// or with a set of fields to select
FLowable<DbRecord> tradeByPrimaryKeyIDAndPrice = rxDb.getBulk("TRADE", Set.of("ID", "PRICE"));
// or both!
FLowable<DbRecord> tradeByIDIDAndPrice = rxDb.getBulk("TRADE", "TRADE_BY_ID", Set.of("ID", "PRICE"));
```

</TabItem>
</Tabs>

### getBulkFromEnd

This will create a `Flowable` of the whole table. If the database layer supports it, these will be sorted in descending order by the index provided, or by the primary key if none is provided.
There is also the `getBulk` function, which will return records in ascending order. There are also a number of continuation operations, which will return the whole table after the provided record.

#### Overloads

* `getBulkFromEnd(table: String index: String): Flowable<DbRecord>`
* `getBulkFromEnd(table: String index: String, fields: Set<String>): Flowable<DbRecord>`
* `getBulkFromEnd(table: String index: String, startRecord: DbRecord? = null): Flowable<DbRecord>` (continuation) (Deprecated)
* `getBulkFromEnd(table: String index: String startRecord: DbRecord? = null, fields: Set<String>): Flowable<DbRecord>` (continuation) (Deprecated)

#### Syntax

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// we can pass in the table name and index name, to sort by that descending
val tradeByIDEveryField = rxDb.getBulkFromEnd("TRADE", "TRADE_BY_ID")
// or with a set of fields to select
val tradeByIDAndPrice = rxDb.getBulkFromEnd("TRADE", "TRADE_BY_ID", setOf("ID", "PRICE"))
```

</TabItem>
<TabItem value="java">

```java
// we can pass in the table name and index name, to sort by that descending
Flowable<DbRecord> tradeByIDEveryField = rxDb.getBulkFromEnd("TRADE", "TRADE_BY_ID");
// or with a set of fields to select
FLowable<DbRecord> tradeByIDIDAndPrice = rxDb.getBulkFromEnd("TRADE", "TRADE_BY_ID", Set.of("ID", "PRICE"));
```

</TabItem>
</Tabs>

### getRange

Whereas a `get` operation selects a single entry from a unique index, and a `getBulk` operation selects the whole table, `getRange` selects a range within an index. 

By providing different parameters, you can refine what information you are returned:
* `startRecord` is needed in all cases, and defines where the range should start from.
* `endRecord` is an optional end record for where the range should end.
* `index` is also needed in all cases, it is the String name of the Index upon which the range spans.
* `numKeyFields` is the number of key fields to take into account for the range.
* `fields` is a set of Strings, that are the names of the fields to be returned. If not provided, or an empty set is provided, all fields will be returned.

#### Overloads

* `getRange(startRecord: DbRecord, index: String, numKeyFields: Int): Flowable<DbRecord>`
* `getRange(startRecord: DbRecord, index: String, numKeyFields: Int, fields: Set<String>): Flowable<DbRecord>`
* `getRange(startRecord: DbRecord, endRecord: DbRecord?, index: String numKeyFields: Int): Flowable<DbRecord>`
* `getRange(startRecord: DbRecord, endRecord: DbRecord?, index: String numKeyFields: Int, fields: Set<String>): Flowable<DbRecord>`

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val startRec = DbRecord("TRADE")
startRec.setString("TRADE_ID", "1")

val endRec = DbRecord("TRADE")
endRec.setString("TRADE_ID", "20")

rxDb.getRange(startRec, "TRADE_BY_ID", 1)
rxDb.getRange(startRec, "TRADE_BY_ID", 1, setOf("TRADE_PRICE", "TRADE_STATUS"))
rxDb.getRange(startRec, endRec, "TRADE_BY_ID", 10)
rxDb.getRange(startRec, endRec, "TRADE_BY_ID", 10, setOf("TRADE_PRICE", "TRADE_STATUS"))
```

</TabItem>
<TabItem value="java">

```java
DbRecord startRec = new DbRecord("TRADE");
startRec.setString("TRADE_ID", "1");

DbRecord endRec = new DbRecord("TRADE");
endRec.setString("TRADE_ID", "20");

getRxDb().getRange(startRec, "TRADE_BY_ID", 1);
getRxDb().getRange(startRec, "TRADE_BY_ID", 1, Set.of("TRADE_PRICE", "TRADE_STATUS"));
getRxDb().getRange(startRec, endRec, "TRADE_BY_ID", 10);
getRxDb().getRange(startRec, endRec, "TRADE_BY_ID", 10, Set.of("TRADE_PRICE", "TRADE_STATUS"));
```

</TabItem>
</Tabs>

### getRangeFromEnd

Works similiary to the `getRange` operation but returns the range in reverse order.

By providing different parameters, you can refine what information you are returned:
* `startRecord` is needed in all cases, and defines where the range should start from.
* `endRecord` is the end record for where the range should end.
* `index` is also needed in all cases, it is the String name of the Index upon which the range spans.
* `numKeyFields` is the number of key fields to take into account for the range.
* `fields` is a set of Strings, that are the names of the fields to be returned. If not provided, or an empty set is provided, all fields will be returned.

#### Overloads

* `fun getRangeFromEnd(startRecord: DbRecord, endRecord: DbRecord, index: I, numKeyFields: Int, fields: Set<String>,): Flowable<DbRecord>`
* `fun getRangeFromEnd(startRecord: DbRecord, endRecord: DbRecord, index: I, numKeyFields: Int,): Flowable<DbRecord>`

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val startRec = DbRecord("TRADE")
startRec.setString("TRADE_ID", "1")

val endRec = DbRecord("TRADE")
endRec.setString("TRADE_ID", "20")

rxDb.getRangeFromEnd(startRec, endRec, "TRADE_BY_ID", 10)
rxDb.getRangeFromEnd(startRec, endRec, "TRADE_BY_ID", 10, setOf("TRADE_PRICE", "TRADE_STATUS"))
```

</TabItem>
<TabItem value="java">

```java
DbRecord startRec = new DbRecord("TRADE");
startRec.setString("TRADE_ID", "1");

DbRecord endRec = new DbRecord("TRADE");
endRec.setString("TRADE_ID", "20");

getRxDb().getRangeFromEnd(startRec, endRec,"TRADE_BY_ID", 1);
getRxDb().getRangeFromEnd(startRec, endRec,"TRADE_BY_ID", 1, Set.of("TRADE_PRICE", "TRADE_STATUS"));
```

</TabItem>
</Tabs>

## Write Operations

### Insert

Single/Multiple records can be inserted into database at a time and returns [WriteResult](../../../database/helper-classes/write-result/)

#### Default values
When writing a record to the database, typically all non-null properties should be set on the DbRecord. An entity property
becomes non-nullable if:

* it has a default value
* it is generated by the database, i.e. sequence or auto increment fields
* the column is included in an index or is specifically declared not null in the schema

`insert` : This will insert a new record into the database, accepts parameter in the form of DbRecord. Has the following signature: `fun insert(record: DbRecord): Single<WriteResult>` 

`insertAll`:  The `insertAll` function takes multiple records in the form of DbRecord, and has following overloads:

* `fun insertAll(records: Flowable<DbRecord>): Single<WriteResult>`
* `fun insertAll(records: List<DbRecord>): Single<WriteResult>`

Please note that the [Single] return value of this method is cold. That is, the underlying operation will not be started unless the [Single] is subscribed to. This can be done either by using one of the [Single.subscribe] functions, running a blocking operation, or combining multiple Single objects into a Flowable and subscribing to that

### Modify

Modifies single/multiple record in the database, which accepts [ModifyDetails](../../../database/helper-classes/modify-details/) and returns [WriteResult](../../../database/helper-classes/write-result/)

#### Overloads

* `fun modify(details: ModifyDetails): Single<WriteResult>`
* `fun modifyAll(details: Flowable<ModifyDetails>): Single<WriteResult>`
* `fun modifyAll(details: List<ModifyDetails>): Single<WriteResult>`

Please note that the [Single] return value of this method is cold. That is, the underlying operation will not be started unless the [Single] is subscribed to. This can be done either by using one of the [Single.subscribe] functions, running a blocking operation, or combining multiple Single objects into a Flowable and subscribing to that

### Upsert

Inserts single/multiple [DbRecord] into the database if it does not exist, and modifies it otherwise. Which accepts [ModifyDetails](../../../database/helper-classes/modify-details/) and returns [WriteResult](../../../database/helper-classes/write-result/)

#### Overloads

* `fun upsert(details: ModifyDetails): Single<WriteResult>`
* `fun upsertAll(details: Flowable<ModifyDetails>): Single<List<WriteResult>>`
* `fun upsertAll(details: List<ModifyDetails>): Single<List<WriteResult>>`

Please note that the [Single] return value of this method is cold. That is, the underlying operation will not be started unless the [Single] is subscribed to. This can be done either by using one of the [Single.subscribe] functions, running a blocking operation, or combining multiple Single objects into a Flowable and subscribing to that

### Delete

Deletes a record/records from the database and returns [WriteResult](../../../database/helper-classes/write-result/)

#### Overloads

* `fun delete(record: DbRecord): Single<WriteResult>`
* `fun deleteAll(records: Flowable<DbRecord>): Single<WriteResult>`
* `fun deleteAll(records: List<DbRecord>): Single<WriteResult>`

Please note that the [Single] return value of this method is cold. That is, the underlying operation will not be started unless the [Single] is subscribed to. This can be done either by using one of the [Single.subscribe] functions, running a blocking operation, or combining multiple Single objects into a Flowable and subscribing to that

### Recover

Performs recover operations on provided record/records and returns [WriteResult](../../../database/helper-classes/write-result/). This is a special operation meant to preserve the original timestamps

#### Overloads

* `fun recover(record: DbRecord): Single<WriteResult>`
* `fun recoverAll(records: Flowable<DbRecord>): Single<WriteResult>`
* `fun recoverAll(records: List<DbRecord>): Single<WriteResult>`

Please note that the [Single] return value of this method is cold. That is, the underlying operation will not be started unless the [Single] is subscribed to. This can be done either by using one of the [Single.subscribe] functions, running a blocking operation, or combining multiple Single objects into a Flowable and subscribing to that

## Transactional Operations

### Read transactions

Read transactions ensure all read operations are consistent. Intervening writes will not affect reads within the
transaction. The return value in the transaction will also be returned from the transaction. For the `RxDb`, it
will be a `Single<T>` where `T` is the value returned in the `readTransaction` lambda.

```java
    rxDb.readTransaction(readTxn -> {
        DbRecord recordToGet = new DbRecord("TRADE");
        recordToGet.setString("ID", "Trade1");

        DbRecord record = readTxn.get(recordToGet, "TRADE_BY_ID").blockingGet();

        return Single.just(record);
    });
```

### Write transactions

Write transactions ensure all read and write operations are consistent. If any exception reaches the
transaction level, all writes are rolled back. The `writeTransaction` will return a `Single<Pair<String List<WriteResult>>>`,
where `T` is the value returned in the `writeTransaction` lambda.

```java
    rxDb.writeTransaction(writeTxn -> {
        DbRecord rec = new DbRecord("TRADE");
        rec.setString("ID", "Trade1");
        rec.setInteger("QUANTITY", 5000);
        rec.setBigDecimal("PRICE", new BigDecimal(32.44));
        rec.setEnum("STATUS", "PENDING");
        rec.setString("CLIENT_ID", "Client1");

        return writeTxn.insert(rec);
    });
```

## Subscribe Operations
Subscribe starts a database listener that receives updates to tables

For table, the way it works is you subscribe to updates, and:
* when a record is inserted, you get an insert update
* when a record is modified you get a modify update
* when a record is deleted you get a delete update

### Bulk subscribe
The `bulkSubscribe` combines a `getBulk` and a `subscribe` call into a single function. This operation is useful when a class needs to read a full table and then receive updates of changes to the underlying table.

`bulkSubscribe` supports the following parameters:

* `tableName`: Name of the table whose updates need to be subscribed.
* `delay`: `Int` the listener will batch updates every x milliseconds.
* `fields`: Is a list of Strings, on which an update queue listener is added and these fields are returned if provided. All fields will be returned if not provided or an empty list is provided.
* `indexName`: `String` index name of table.
* `subscribeLocally`: `Boolean` only publish updates local to the node.

#### Overloads

* `fun bulkSubscribe(tableName: String, fields: List<String> = emptyList(), delay: Int? = null, subscribeLocally: Boolean = false,): Flowable<Bulk<DbRecord>>`.
* `fun bulkSubscribe(tableName: String, indexName: String, fields: List<String> = emptyList(), delay: Int? = null, subscribeLocally: Boolean = false,): Flowable<Bulk<DbRecord>>`.

### Range subscribe

Range subscribe is like bulk subscribe, but it combines a `getRange` with `subscribe`. This operation is useful when
a class needs to read part of a table or view and then keep updated of any changes.

`rangeSubscribe` supports the following parameters:

* `startRecord`: Defines where the range should start from.
* `endRecord`: This is an optional end record for where the range should end.
* `delay`: `Int` the listener will batch updates every x milliseconds.
* `numKeyFields`: `Int` the number of key fields to take into account for the range.
* `fields`: Is a set of Strings, on which an update queue listener is added and these fields are returned if provided. All fields will be returned if not provided, or an empty set is provided.
* `indexName`: It is the String name of the Index upon which the range spans.
* `subscribeLocally`: `Boolean` only publish updates local to the node.
* `updateFrequency`: `PalDuration` a schedule for updating dynamic ranges.

#### Overloads

* `fun rangeSubscribe(startRecord: DbRecord, endRecord: DbRecord?, indexName: String, numKeyFields: Int, fields: Set<String> = emptySet(), delay: Int? = null, subscribeLocally: Boolean = false,): Flowable<Bulk<DbRecord>>`
* `fun rangeSubscribe(startRecord: DbRecord, indexName: String, numKeyFields: Int, fields: Set<String> = emptySet(), delay: Int? = null, subscribeLocally: Boolean = false,): Flowable<Bulk<DbRecord>>`
* `fun rangeSubscribe(startRecord: () -> DbRecord, endRecord: (() -> DbRecord)?, indexName: String, numKeyFields: Int, fields: Set<String> = emptySet(), delay: Int? = null, subscribeLocally: Boolean = false, updateFrequency: PalDuration = PalDuration.Never,): Flowable<Bulk<DbRecord>>`
* `fun rangeSubscribe(startRecord: () -> DbRecord, indexName: String, numKeyFields: Int, fields: Set<String> = emptySet(), delay: Int? = null, subscribeLocally: Boolean = false, updateFrequency: PalDuration = PalDuration.Never,): Flowable<Bulk<DbRecord>>`
