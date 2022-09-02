---
title: 'RxDb'
sidebar_label: 'RxDb'
id: rxdb
---

[Introduction](/database/database-interface/database-interface/)  | [EntityDb](/database/database-interface/entity-db/) |  [Generated repositories](/database/database-interface/generated-repositories/) | [RxDb](/database/database-interface/rxdb/) 

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::warning

Using `RxDb` instead of [entityDb](/database/database-interface/entity-db/) or [generated repositories](/database/database-interface/generated-repositories/) will circumvent compile-time validation of database interactions. This means that errors might not appear until runtime or might lead to unexpected results.

:::

The `RxDb` enables you to interact with the database layer, but you do not have any level of type-safety when doing so. Instead, it uses [Flowable](/database/types-of-api/rxjava/#flowable) entities. 

//unsure on this, rewrite
The interface supports the same operations as the generated repositories, but will accept any entity. It supports read and write operations for tables only.

The RxDb can be injected in Kotlin and Java using `RxDb`.

|                                                                                                 | [RxDb](/database/database-interface/rxdb/)                                                                                      |
|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| [Supports tables](/database/fields-tables-views/tables/tables-basics/)                          | ✔️                                                                                                                              |
| [Supports views](/database/fields-tables-views/views/views-basics/)                             | ❌️                                                                                                                              |
| Supports any data type                                                                          | ✔️                                                                                                                              |
| Class to import                                                                                 | `RxDb`                                                                                                                          |
| Type-safe read and write                                                                        | ❌️                                                                                                                              |
| Type-safe write result                                                                          | ❌️                                                                                                                              |
| Returns data as                                                                                 | [RxJava return type](/database/types-of-api/rxjava/#rxjava-return-types) of [DbRecord](/database/data-types/dbrecord/) entities |
| Writes data as                                                                                  | [DbRecord](/database/data-types/dbrecord/) entities                                                                             |
| References indexes as                                                                           | Strings                                                                                                                         |
| Programming interface                                                                           | [RxJava](/database/types-of-api/rxjava/)                                                                                        |
| Write (input)                                                                                   | [Modify Details](/database/helper-classes/modify-details/#entity-modify-details)                                                |
| Write (output)                                                                                  | [Write Result](/database/helper-classes/write-result/#entity-write-result)                                                      |
| Subscribe                                                                                       | [Record Update](/database/helper-classes/subscription/record-update/) of entity                                                 |
| Bulk or Range Subscribe                                                                         | [Flowable](/database/types-of-api/rxjava/#flowable) of [Bulk](/database/helper-classes/subscription/bulk/) of entity            |
| Available in [Custom Event Handlers](/database/api-reference/event-handler-api/)         | ✔️                                                                                                                              |
| Available in [Custom Request Servers](/server-modules/request-server/advanced/#custom-request-servers) | ❌️                                                                                                                              |

## Type convention

| Type                               | Meaning                           | Example         |
|------------------------------------|-----------------------------------|-----------------|
| `T`                                | A table name                      | `"TRADE"`       |
| `I`                                | An index name                     | `"TRADE_BY_ID"` |
| `U`                                | A unique index                    | `"TRADE_BY_ID"`  |


## Read Operations

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
val trade = rxDb.get(findRec, "TRADE_BY_ID").blockingGet()

// or we can provide which fields we are looking for, by passing in a set:
val fields = setOf("ID", "CLIENT_ID")
val trade =  rxDb.get(findRec, "TRADE_BY_ID", fields).blockingGet()
```

</TabItem>
<TabItem value="java">

```java
// we can look up trades by passing in just an index, this will load all the fields:
final DbRecord findRec = new DbRecord("TRADE");
findRec.setString("ID", "00001");
final DbRecord trade = rxDb.get(findRec, "TRADE_BY_ID").blockingGet();

// or we can provide which fields we are looking for, by passing in a set:
final Set<String> fields = Set.of("ID", "CLIENT_ID");
final DbRecord trade = rxDb.get(findRec, "TRADE_BY_ID", fields).blockingGet();

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

val details1 = RecordMapSearchDetails.newInstance(record1, findKey, "FirstTrade")

val rec2 = new DbRecord("TRADE")
rec2.setString("ID", "Trade2")

val details2 = RecordMapSearchDetails.newInstance(rec2, findKey, "SecondTrade")

val recordMapSearchDetails = listOf(details1, details2)

//As you can see, creating the recordMapSearchDetails can be an involved process.
final Map<String, DbRecord> resultsMapFromList = rxDb.getAll(recordMapSearchDetails).blockingGet();

val recordA1 = resultsMapFromList["A"]
val recordB1 = resultsMapFromList["B"]

//The list can also be converted into a Flowable, this same process is done within the above getAll(List<>).
val resultsMapFromFlowable = rxDb.getAll(Flowable.fromIterable(recordMapSearchDetails)).blockingGet()

val recordA2 = resultsMapFromFlowable["A"]
val recordB2 = resultsMapFromFlowable["B"]
```

</TabItem>
<TabItem value="java">

```java
final String findKey = "TRADE_BY_ID";

final DbRecord record1 = new DbRecord("TRADE");
record1.setString("ID", "00001");

final RecordMapSearchDetails details1 = RecordMapSearchDetails.newInstance(record1, findKey, "FirstTrade");

final DbRecord rec2 = new DbRecord("TRADE");
rec2.setString("ID", "Trade2");

final RecordMapSearchDetails details2 = RecordMapSearchDetails.newInstance(rec2, findKey, "SecondTrade");

final List<RecordMapSearchDetails> recordMapSearchDetails = Lists.newArrayList();
requestDetails.add(details1);
requestDetails.add(details2);

//As you can see, creating the recordMapSearchDetails can be an involved process.
final Map<String, DbRecord> resultsMapFromList = rxDb.getAll(recordMapSearchDetails).blockingGet();

final DbRecord recordA1 = resultsMapFromList["A"];
final DbRecord recordB1 = resultsMapFromList["B"];

//The list can also be converted into a Flowable, this same process is done within the above getAll(List<>).
final Map<String, DbRecord> resultsMapFromFlowable = rxDb.getAll(Flowable.fromIterable(recordMapSearchDetails)).blockingGet();

final DbRecord recordA2 = resultsMapFromFlowable["A"];
final DbRecord recordB2 = resultsMapFromFlowable["B"];
```
</TabItem>
</Tabs>

### getAllAsList

This operation is similar to the one above, but will return a `List<E?>`. The results are returned in the order they were requested and will be `null` if no record was found. 
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

val rec2 = new DbRecord("TRADE")
rec2.setString("ID", "Trade2")

val details2 = RecordMapSearchDetails.newInstance(rec2, findKey, "SecondTrade")

val recordMapSearchDetails = listOf(details1, details2)

//As you can see, creating the recordMapSearchDetails can be an involved process.
final Map<String, DbRecord> resultsMapFromList = rxDb.getAllAsList(recordMapSearchDetails).blockingGet();

val recordA1 = resultsMapFromList[0]
val recordB1 = resultsMapFromList[1]

//The list can also be converted into a Flowable, this same process is done within the above getAll(List<>).
val resultsMapFromFlowable = rxDb.getAllAsList(Flowable.fromIterable(recordMapSearchDetails)).blockingGet()

val recordA2 = resultsMapFromFlowable[0]
val recordB2 = resultsMapFromFlowable[1]
```

</TabItem>
<TabItem value="java">

```java
final String findKey = "TRADE_BY_ID";

final DbRecord record1 = new DbRecord("TRADE");
record1.setString("ID", "00001");

final RecordMapSearchDetails details1 = RecordMapSearchDetails.newInstance(record1, findKey, "FirstTrade");

final DbRecord rec2 = new DbRecord("TRADE");
rec2.setString("ID", "Trade2");

final RecordMapSearchDetails details2 = RecordMapSearchDetails.newInstance(rec2, findKey, "SecondTrade");

final List<RecordMapSearchDetails> recordMapSearchDetails = Lists.newArrayList();
requestDetails.add(details1);
requestDetails.add(details2);

//As you can see, creating the recordMapSearchDetails can be an involved process.
final Map<String, DbRecord> resultsMapFromList = rxDb.getAll(recordMapSearchDetails).blockingGet();

final DbRecord recordA1 = resultsMapFromList[0];
final DbRecord recordB1 = resultsMapFromList[1];

//The list can also be converted into a Flowable, this same process is done within the above getAll(List<>).
final Map<String, DbRecord> resultsMapFromFlowable = rxDb.getAll(Flowable.fromIterable(recordMapSearchDetails)).blockingGet();

final DbRecord recordA2 = resultsMapFromFlowable[0];
final DbRecord recordB2 = resultsMapFromFlowable[1];
```
</TabItem>
</Tabs>

### getBulk

This will create a `Flow` or `Flowable` of the whole table. If the database layer supports it, these will be sorted in ascending order by the index provided, or by the primary key if none is provided. 
There is also the `getBulkFromEnd` function, which will return records in descending order. There are also a number of continuation operations, which will return the whole table after the provided record.

#### Overloads

* `getBulk(table: T): Flowable<DbRecord>`
* `getBulk(table: T, index: I? ): Flowable<DbRecord>`
* `getBulk(table: T, fields: Set<String>): Flowable<DbRecord>`
* `getBulk(table: T, index: I?, fields: Set<String>): Flowable<DbRecord>`
* `getBulk(table: T, index: I?, record: DbRecord?): Flowable<DbRecord>` (continuation) (Deprecated)
* `getBulk(table: T, index: I?, record: DbRecord?, fields: Set<String>): Flowable<DbRecord>` (continuation) (Deprecated)

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
final Flowable<DbRecord> tradeByPrimaryKeyEveryField = rxDb.getBulk("TRADE");
// or with an index name to get it sorted by that
final Flowable<DbRecord> tradeByIDEveryField = rxDb.getBulk("TRADE", "TRADE_BY_ID");
// or with a set of fields to select
final FLowable<DbRecord> tradeByPrimaryKeyIDAndPrice = rxDb.getBulk("TRADE", Set.of("ID", "PRICE"));
// or both!
final FLowable<DbRecord> tradeByIDIDAndPrice = rxDb.getBulk("TRADE", "TRADE_BY_ID", Set.of("ID", "PRICE"));
```
</TabItem>
</Tabs>

### getBulkFromEnd

This will create a `Flow` or `Flowable` of the whole table. If the database layer supports it, these will be sorted in descending order by the index provided, or by the primary key if none is provided.
There is also the `getBulk` function, which will return records in ascending order. There are also a number of continuation operations, which will return the whole table after the provided record.

#### Overloads

* `getBulkFromEnd(table: T, index: I): Flowable<DbRecord>`
* `getBulkFromEnd(table: T, index: I, fields: Set<String>): Flowable<DbRecord>`
* `getBulkFromEnd(table: T, index: I, startRecord: DbRecord? = null): Flowable<DbRecord>` (continuation) (Deprecated)
* `getBulkFromEnd(table: T, index: I, startRecord: DbRecord? = null, fields: Set<String>): Flowable<DbRecord>` (continuation) (Deprecated)

#### Syntax

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// we can pass in the table name and index name, to sort by that descending
val tradeByIDEveryField = rxDb.getBulkFromEnd("TRADE", "TRADE_BY_ID")
// or with a set of fields to select
val tradeByIDIDAndPrice = rxDb.getBulkFromEnd("TRADE", "TRADE_BY_ID", setOf("ID", "PRICE"))
```

</TabItem>
<TabItem value="java">

```java
// we can pass in the table name and index name, to sort by that descending
final Flowable<DbRecord> tradeByIDEveryField = rxDb.getBulkFromEnd("TRADE", "TRADE_BY_ID");
// or with a set of fields to select
final FLowable<DbRecord> tradeByIDIDAndPrice = rxDb.getBulkFromEnd("TRADE", "TRADE_BY_ID", Set.of("ID", "PRICE"));
```
</TabItem>
</Tabs>
</TabItem>
</Tabs>

### getRange

Whereas a `get` operation selects a single entry from a unique index, and a `getBulk` operation selects the whole table, `getRange` selects a range within an index. 

By providing different parameters, you can refine what information you are returned:
* `startRecord` is needed in all cases, and defines where the range should start from.
* `endRecord` is an optional end record for where the range should end.
* `index` is also needed in all cases, it is the String name of the Index upon which the range spans.
* `numKeyFields` is the last of the mandatory fields, it ???
* `fields` is a set of Strings, that are the names of the fields to be returned. If not provided, or an empty set is provided, all fields will be returned.

#### Overloads

* `getRange(startRecord: DbRecord, index: I, numKeyFields: Int): Flowable<DbRecord>`
* `getRange(startRecord: DbRecord, index: I, numKeyFields: Int, fields: Set<String>): Flowable<DbRecord>`
* `getRange(startRecord: DbRecord, endRecord: DbRecord?, index: I, numKeyFields: Int): Flowable<DbRecord>`
* `getRange(startRecord: DbRecord, endRecord: DbRecord?, index: I, numKeyFields: Int, fields: Set<String>): Flowable<DbRecord>`

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// there are multiple ways to get a range of records, either for some fields
// of a unique index or some or all fields of a non unique index:
db.getRange(Trade.byTypeId("typeA"))
db.getRange(trade.byTypeId(), 1)
db.getRange(trade, Trade.ByTypeId, 1)

// or by setting a start and an end range:
db.getRange(Trade.byTypeId("tradeType1"), Trade.byTypeId("tradeType2"))
db.getRange(trade1.byTypeId(), trade2.byTypeId(), 1).toList()
db.getRange(trade1, trade2, Trade.ByTypeId, 1).toList()
```

</TabItem>
<TabItem value="java">

```java
// there are multiple ways to get a range of records, either for some fields
// of a unique index or some or all fields of a non unique index:
db.getRange(Trade.byTypeId("typeA"));
db.getRange(trade.byTypeId(),1);
db.getRange(trade,Trade.ByTypeId.Companion,1);

// or by setting a start and an end range:
db.getRange(Trade.byTypeId("tradeType1"),Trade.byTypeId("tradeType2"));
db.getRange(trade1.byTypeId(),trade2.byTypeId(),1).toList();
db.getRange(trade1,trade2,Trade.ByTypeId.Companion,1).toList();
```
</TabItem>
</Tabs>

### getRangeFromEnd

Works similiary to the `getRange` operation but returns the range in reverse order.

By providing different parameters, you can refine what information you are returned:
* `startRecord` is needed in all cases, and defines where the range should start from.
* `endRecord` is the end record for where the range should end.
* `index` is also needed in all cases, it is the String name of the Index upon which the range spans.
* `numKeyFields` is the last of the mandatory fields, it ???
* `fields` is a set of Strings, that are the names of the fields to be returned. If not provided, or an empty set is provided, all fields will be returned.

#### Overloads

* `getRange(startRecord: DbRecord, endRecord: DbRecord?, index: I, numKeyFields: Int): Flowable<DbRecord>`
* `getRange(startRecord: DbRecord, endRecord: DbRecord?, index: I, numKeyFields: Int, fields: Set<String>): Flowable<DbRecord>`

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// there are multiple ways to get a range of records, either for some fields
// of a unique index or some or all fields of a non unique index:
db.getRange(Trade.byTypeId("typeA"))
db.getRange(trade.byTypeId(), 1)
db.getRange(trade, Trade.ByTypeId, 1)

// or by setting a start and an end range:
db.getRange(Trade.byTypeId("tradeType1"), Trade.byTypeId("tradeType2"))
db.getRange(trade1.byTypeId(), trade2.byTypeId(), 1).toList()
db.getRange(trade1, trade2, Trade.ByTypeId, 1).toList()
```

</TabItem>
<TabItem value="java">

```java
// there are multiple ways to get a range of records, either for some fields
// of a unique index or some or all fields of a non unique index:
db.getRange(Trade.byTypeId("typeA"));
db.getRange(trade.byTypeId(),1);
db.getRange(trade,Trade.ByTypeId.Companion,1);

// or by setting a start and an end range:
db.getRange(Trade.byTypeId("tradeType1"),Trade.byTypeId("tradeType2"));
db.getRange(trade1.byTypeId(),trade2.byTypeId(),1).toList();
db.getRange(trade1,trade2,Trade.ByTypeId.Companion,1).toList();
```
</TabItem>
</Tabs>
