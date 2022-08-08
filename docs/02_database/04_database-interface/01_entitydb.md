---
sidebar_position: 2
title: EntityDb
sidebar_label: EntityDb
id: entity-db

---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

|                                                                                                 | [EntityDb](/database/database-interface/entity-db/)                                                           |
|-------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| [Supports tables](/database/fields-tables-views/tables/tables-basics/)                                      | ✔️                                                                                 |
| [Supports views](/database/fields-tables-views/views/views-basics/)                                        | ✔️                                                                                 |
| Supports any data type                                                                          | ✔️                                                                                 |
| Class to import                                                                                 | `AsyncEntityDb` <br/> `RxEntityDb`                                                 |
| Type-safe read and write                                                                        | ✔️                                                                                 |
| Type-safe write result                                                                          | ✔️                                                                                 |
| Returns data as                                                                                 | [table](database/data-types/table-entities/) or [view](/database/data-types/views-entities/) entities        |
| Writes data as                                                                                  | [table](database/data-types/table-entities/) or [view](/database/data-types/views-entities/) entities        |
| References indexes as                                                                           | [index entities](/database/data-types/index-entities/)                                         |
| Programming interface                                                                           | [Async](/database/types-of-api/asynch/) or [RxJava](/database/types-of-api/rxjava/) |
| Write (input)                                                                                   | [Generic Modify Details](/database/helper-classes/modify-details/generic/)                              |
| Write (output)                                                                                  | [Generic Write Result](/database/helper-classes/write-results/generic/)                          |
| Subscribe                                                                                       | [Record Update](/database/helper-classes/subscription/record-update/) of entity                 |
| Bulk or Range Subscribe                                                                         | [Bulk](/database/helper-classes/subscription/bulk/) of entity                                   |


| Available in [event handlers](/database/event-handler-api/event-handler-api/)         | ✔️                                                                                 |
| Available in [custom request servers](/server-modules/request-server/advanced/#custom-request-servers) | ✔️                                                                                 |


The entity db enables you to interact with the database layer; you can use any generated type-safe entities for
tables and views. The interface supports the same operations as the generated repositories, but will accept any
entity. It supports read operations for views and tables and write operations for tables only.

The entity db differs from the generated repositories in that it can handle any table and most view entities. It differs from `RxDb` in that all operations are type-safe.

As with the generated repositories, there are two flavours of the entity db:

* One has a [RxJava API](/database/types-of-api/rxjava/) signatures, for use from Java.

* The other flavour has an [Async API](/database/types-of-api/asynch/), for use from Kotlin.

The entity db is available in the kotlin Event Handler. Like `RxDb` it can also be injected in java and kotlin
classes using `AsyncEntityDb` or `RxEntityDb`.

When referring to indices in the database operations, the database accepts _index classes_ or _entity class_
in combination with _index references_. For comparison:

## Type convention

| Type                               | Meaning                           | Example        |
|------------------------------------|-----------------------------------|----------------|
| `E`                                | A table or view entity            | `Trade`        |
| `T`                                | A table entity                    | `Trade`        |
| `V`                                | A view entity                     | `TradeView`    |
| `EntityIndex<E>`                   | An index of E                     | `Trade.ById`   |
| `UniqueEntityIndex<E>`             | A unique index of E               | `Trade.ById`   |
| `NonUniqueEntityIndex<E>`          | A non unique index of E           | `Trade.ByDate` |
| `EntityIndexReference<E>`          | An index reference of E           | `Trade.ById`   |
| `UniqueEntityIndexReference<E>`    | A unique index reference of E     | `Trade.ById`   |
| `NonUniqueEntityIndexReference<E>` | A non unique index reference of E | `Trade.ByDate` |
| `F<E>`                             | The full table /view name for E   | `TRADE`        |
| `Class<E>`                         | The class reference for E         | `Trade.class`  |
| `KClass<E>`                        | The kotlin class reference for E  | `Trade::class` |


## Read Operations

### get

Get is a simple lookup on the database; it will return a single entity if a match is found, or no records if none is
found.

The following overloads exist for get; fields is a `Set<String>`.

* `get(E, EntityIndexReference<E>, fields) : E?`
* `get(E, fields) : E?`
* `get(E, EntityIndexReference<E>) : E?`
* `get(UniqueEntityIndex<E>, fields) : E?`
* `get(UniqueEntityIndex<E>) : E?`

#### Syntax

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// we can look up trades by passing in a unique index class:
val trade = db.get(Trade.byId("TRADE_1"))

// a trade object with the primary key set 
val trade = db.get(trade)

// a trade object and a reference to unique index
val trade = db.get(trade, Trade.ByTypeId)

// or you can access the index class from the entity
val trade = db.get(trade.byTypeId())
```

</TabItem>
<TabItem value="java">

```java
// we can look up trades by passing in a unique index class:
final var trade = db.get(Trade.byId("TRADE_1"))
        .blockingGet();

// a trade object with the primary key set 
final var trade = db.get(trade)
        .blockingGet();

// a trade object and a reference to unique index
final var trade = db.get(trade,Trade.ByTypeId.Companion)
        .blockingGet();

// or you can access the index class from the entity
final var trade = db.get(trade.byTypeId())
        .blockingGet();
```
</TabItem>
</Tabs>

### getAll

Get all will take multiple _unique_ index class instances and return the type entity type for the record. It takes
a `List<Pair<String, NonUniqueEntityIndex<E>>>`, where the `String` is a unique reference to each request.

#### Overloads

* `getAll(requestDetails: Flow<Pair<String, UI<E>>): Map<String, E?>`
* `getAll(requestDetails: List<Pair<String, UI<E>>): Map<String, E?>`

```kotlin
val map = db.getAll(listOf("A" to Trade.byId("TRADE_A"), "B" to Trade.byId("TRADE_B")))

val recordA = map["A"]
val recordB = map["B"]
```

### getAllAsList

This operation is similar to the one above, but takes a `List<NonUniqueEntityIndex<E>>`, and will return a `List<E?>`.
The results are returned in the order they were requested and will be `null` if no record was found. The result
list is guaranteed to be the same count as the input.

#### Overloads

* `getAllAsList(Flow<UI<E>>): List<E?>`
* `getAllAsList(List<UI<E>>): List<E?>`
* `getAllAsList(vararg UI<E>): List<E?>`

```kotlin
val list = db.getAllAsList(Trade.byId("TRADE_A"), Trade.byId("TRADE_B"))

val recordA = list[0]
val recordB = list[1]
```

### getBulk

This will create a `Flow` or `Flowable` of the whole table. If the database layer supports it, these will be
sorted in ascending order by the index provided, or by the primary key if none is provided. Currently, only
FoundationDb and Postgres support an ordered `getBulk`. There is also the `getBulkFromEnd` function, which will
return records in descending order. There are also a number of continuation operations, which will return
the whole table after the provided record.

#### Overloads

* `getBulk<E>(): Flow<E>` (kotlin only)
* `getBulk([Class<E> /  KClass<E>]): Flow<E>`
* `getBulk(UR<E>): Flow<E>`
* `getBulk(UR<E>, fields): Flow<E>`
* `getBulk(UR<E>, E, fields): Flow<E>` (continuation)
* `getBulkFromEnd(UR<E>): Flow<E>`
* `getBulkFromEnd(UR<E>, E), E: Flow<E>` (continuation)
* `getBulkFromEnd(UR<E>, E, fields), E: Flow<E>` (continuation)
* `getBulkFromEnd(UR<E>, fields): Flow<E>`

#### Syntax

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// we can pass in Trade as a type parameter
val flow = db.getBulk&lt;Trade>()
// we can pass in the TRADE object
val flow = db.getBulk(TRADE)
// or we can pass in an index reference
val flow = db.getBulk(Trade.ByTypeId)
```

</TabItem>
<TabItem value="java">

```java
// we can pass in Trade as a type parameter
final var flowable = db.getBulk(Trade.class);
// we can pass in the TRADE object
final var flowable = db.getBulk(TRADE.INSTACE);
// or we can pass in an index reference
final var flowable = db.getBulk(Trade.ById.Companion);
```
</TabItem>
</Tabs>

### getRange

Whereas a `get` operation selects a single entry from a unique index, and a `getBulk` operation selects the whole
table, `getRange` selects a range within an index. For example, to select all trades by a single currency, there
are a number of ways a range can be specified:

* A non-unique index entry.
* A range between two index entries.
* When an index has more than one column, part of the index starting from the first column.

When selecting on part of an index, the number of columns can be specified using the `numKeyFields` parameter. The fields
are always selected in the order they are specified in the index.

There are 15 different get range functions. The records will be returned in ascending order, apart from when using
the `fromEnd` functions, in which case the records will be returned in descending order. 

The `numKeyFields` property
specifies the number of fields to use from an index. For example, in the `TRADE` example, there is the `TRADE_BY_TYPE_ID`
index. If we pass 1 for `numKeyFields`, the range will return records by `TRADE_TYPE`, which is the first column in that index.

#### Overloads

* `getRange(E, EntityIndexReference<E>, numKeyFields): Flow<E>`
* `getRange(E, EntityIndexReference<E>, numKeyFields, fields): Flow<E>`
* `getRange(E, E?, EntityIndexReference<E>, numKeyFields): Flow<E>`
* `getRange(E, E?, EntityIndexReference<E>, numKeyFields, fields): Flow<E>`
* `getRange(EntityIndex<E>, numKeyFields): Flow<E>`
* `getRange(EntityIndex<E>, numKeyFields, fields): Flow<E>`
* `getRange(NonUniqueEntityIndex<E>, NonUniqueEntityIndex<E>): Flow<E>`
* `getRange(NonUniqueEntityIndex<E>): Flow<E>`
* `getRange(NonUniqueEntityIndex<E>, fields): Flow<E>`
* `getRange(EntityIndex<E>, EntityIndex<E>, numKeyFields): Flow<E>`
* `getRange(EntityIndex<E>, EntityIndex<E>, numKeyFields, fields): Flow<E>`
* `getRangeFromEnd(E, E, EntityIndexReference<E>, numKeyFields, fields): Flow<E>`
* `getRangeFromEnd(E, E, EntityIndexReference<E>, numKeyFields): Flow<E>`
* `getRangeFromEnd(EntityIndex<E>, EntityIndex<E>, numKeyFields, fields): Flow<E>`
* `getRangeFromEnd(EntityIndex<E>, EntityIndex<E>, numKeyFields): Flow<E>`

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

## Write Operations

All write operations have versions that take a single entity and versions that take multiple entries. 

The return values for these operations are type-safe (see details below), provided all entries are of the same type. For example, when
inserting multiple `Trade` entries, the return type will be `List<InsertResult<Trade>>`. Different entity types can be
inserted in the same operation; however, the return type will be `List<InsertResult<Entity>>`. Also, modify operations
only accept table entities.

### Default and generated values

When writing a record to the database, typically all non-null properties should be set on the entity. An entity property
becomes non-nullable if:

* it has a default value
* it is generated by the database, i.e. sequence or auto increment fields
* the column is included in an index or is specifically declared not null in the schema

#### Default values

Properties with a default value will have the value set by default, unless set explicitly in the builder.

#### Generated properties

Generated properties will be left in an indeterminate state if not set in the builder. When writing to the
database, this indeterminate state will be set in the return value. Trying to read the property while it is
in this state will result in an `IllegalArugmentException`. Each generated property will have two read-only
associated properties to access these properties in a safe manner. These are an `is[FieldName]Generated`
boolean property and a `[fieldName]OrNull` property.

For example:

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
// tradeId is generated
trade.tradeId                   // will cause an exception if not initialised
trade.tradeIdOrNull             // will return the tradeId if set, or else null
trade.isTradeIdInitialised      // will return true if set
```

</TabItem>
<TabItem value="java">

```java
// tradeId is generated
trade.getTradeId();             // will cause an exception if not initialised
trade.getTradeIdOrNull();       // will return the tradeId if set, or else null
trade.isTradeIdInitialised();   // will return true if set
```
</TabItem>
</Tabs>

#### Columns in indices or are not null explicitly

Columns in indices or declared not null should always be set in a builder, unless it has a default value or is a
generated column. In all other instances, a `NullPointerException` will be thrown when building the object.

### Insert

This will insert a new record into the database. The `insert` function takes a single table entity. The `insertAll`
function takes multiple records, and has several overloads:

#### Overloads

* `insert(E): InsertResult<E>`
* `insertAll(vararg E): List<InsertResult<E>>`
* `insertAll(List<E>): List<InsertResult<E>>`
* `insertAll(Flow<E>): List<InsertResult<E>>`

### Modify

This will try to modify a record in the database. If the record does not exist, an error will be thrown.

#### Overloads

* `modify(EntityModifyDetails<E>): ModifyResult<E>`
* `modify(E): ModifyResult<E>`
* `modify(E, UniqueEntityIndexReference<E>): ModifyResult<E>`
* `modifyAll(vararg E): List<ModifyResult<E>>`
* `modifyAll(vararg EntityModifyDetails<E>): List<ModifyResult<E>>`
* `modifyAll(List<EntityModifyDetails<E>>): List<ModifyResult<E>>`
* `modifyAll(Flow<EntityModifyDetails<E>>): List<ModifyResult<E>>`

### Upsert

This will try to modify a record in the database. If the record does not exist, the record will be inserted instead.

#### Overloads

* `upsert(EntityModifyDetails<E>): UpsertResult<E>`
* `upsert(E): UpsertResult<E>`
* `upsertAll(vararg E): List<UpsertResult<E>>`
* `upsertAll(vararg EntityModifyDetails<E>): List<UpsertResult<E>>`
* `upsertAll(List<EntityModifyDetails<E>>): List<UpsertResult<E>>`
* `upsertAll(Flow<EntityModifyDetails<E>>): List<UpsertResult<E>>`

### Delete

This will try to delete a record.

#### Overloads

* `delete(E): DeleteResult<E>`
* `delete(UniqueEntityIndex<E>): DeleteResult<E>`
* `deleteAll(vararg E): List<DeleteResult<E>>`
* `deleteAll(vararg UniqueEntityIndex<E>): List<DeleteResult<E>>`
* `deleteAll(List<E>): List<DeleteResult<E>>`
* `deleteAll(Flow<E>): List<DeleteResult<E>>`

### Update

The update operation is a condensed syntax for modifying data in the database. It works by providing a scope and a
transformation. The scope could be one of:

* `updateBy` - a unique index
* `updateRangeBy` - an index range
* `updateAll` - a whole table

The transformation is a lambda, where the rows that are in scope are provided one by one. The rows are provided as in
the database, and can be modified in place, with the changes applied to the database. All update calls will use the
`safeWriteTransaction` and will be transactional if the database supports it.

* In the async entity db, the lambda will be of type `E.() -> Unit`. The entity will be the receiver and in the lambda,
`this` will refer to the row, which should be modified in place.

* In the rx entity db, the lambda will be of type `Consumer<E>`. The lambda will have a single parameter, the entity.
Similar to the async version, the row should be modified in place.

In both cases, the full record will be provided, and values can be read as well as updated. The operations return
`List<ModifyResult<E>>` for `updateAll` and `updateRangeBy` methods and `ModifyResult<E>` for the `updateBy` operation.

For example:

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
db.updateBy(Trade.byId("xxxxx")) {
    price = 15.0
}

db.updateByRange(Trade.byOrderId("xxxx")) {
    orderStatus = OrderStatus.CANCELLED
}

db.updateByRange(Trade.byOrderId("xxxx"), Trade.byOrderId("yyyy") {
    orderStatus = OrderStatus.CANCELLED
}

db.updateAll<Trade> {
    orderStatus = OrderStatus.CANCELLED
}
```

</TabItem>
<TabItem value="java">

```java
db.updateBy(Trade.byId("xxx"), trade -> {
    trade.setPrice(15.0);
}).blockingGet();

db.updateByRange(Trade.byOrderId("xxxx"), trade -> {
    trade.setTradeType(OrderStatus.CANCELLED);
}).blockingGet();

db.updateByRange(Trade.byOrderId("xxxx"), Trade.byOrderId("yyyy"), trade -> {
    trade.setTradeType(OrderStatus.CANCELLED);
}).blockingGet();

db.updateAll(Trade.class, trade -> {
    trade.setTradeType(OrderStatus.CANCELLED);
}).blockingGet();
```

</TabItem>
</Tabs>

## Transactions

If the underlying database supports transactions, then the entity db provides type-safe access to these. A read transaction will support the same read operations as the entity db, and a write transaction will support the same read and write operations. If a write transaction fails, all operations will be reverted. Subscribe operations are not supported within transactions.

Currently, transactions are supported on **FoundationDb** and **Postgresql**. Using transaction on **Aerospike** will result in a failure.

When code is expected to run on multiple database types, transactions should be used when available. You can use `safeReadTransaction` and `safeWriteTransaction`. These will run operations in the block in a single transaction, if supported.

There is a distinction between using kotlin and java here.

* When using kotlin, the transaction is the receiver in the `readTransaction` call. This means that within the block, `this` refers to the transaction. 
* When using java world, the transaction is the first parameter of the lambda.

### Read transactions

Read transactions ensure all read operations are consistent. Intervening writes will not affect reads within the
transaction. The return value in the transaction will also be returned from the transaction. For the `RxEntityDb`, it
will be a `Single<*>`.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val orderTrade = db.readTransaction {
    val trade = get(Trade.byId("TR_123"))
    val order = get(Order.byId(trade.orderId))
    buildOrderTrade(order, trade)
}
```

</TabItem>
<TabItem value="java">

```java
Single<OrderTrade> oderTrade = db.readTransaction(transaction -> {
    final var trade = transaction.get(Trade.byId("TR_123")).blockingGet();
    final var order = transaction.get(Order.byId(trade.orderId)).blockingGet();
    return buildOrderTrade(order, trade);
});
```
</TabItem>
</Tabs>

### Write Transactions

Write transactions ensure all read and write operations are consistent. If any exception reaches the
transaction level, all writes are rolled back. The `writeTransaction` will return a `Pair<T, List<EntityWriteResult<*>>>`,
where `T` is the value returned in the `writeTransaction` lambda.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val (orderId, writeResults) = db.writeTransaction {
    insert(trade)
    val orderInsert = insert(order)
    orderInsert.record.orderId
}
```

</TabItem>
<TabItem value="java">

```java
final var pair = db.writeTransaction(transaction -> {
    insert(trade).blockingGet();
    final var orderInsert = insert(order).blockingGet();
    return orderInsert.getRecord.getOrderId();
}).blockingGet();
final var orderId = pair.getFirst();
final var writeResults = pair.getSecond();
```
</TabItem>
</Tabs>

## Subscribe operations

### Subscribe

Subscribe starts a database listener that receives updates to tables or views. When subscribing to view updates,
only updates to the root table will be published. 

If the view has any inner joins, these are handled in a range of different ways.

For tables, this works in the standard way. You subscribe to updates, and:
* when a record is inserted, you get an insert update
* when a record is modified you get a modify update 
* when a record is deleted you get a delete update 


For views, when a record is inserted to the root table, you get an insert update. Modify and delete work the same way. 

However, if there is an inner join, there is a range of outcomes.

For example, if you join onto counterparty, and you only return records for which you have a valid counterparty:

* if there is an insert with no valid counterparty, the listener to view will not receive the insert
* if there is a delete with no valid counterparty, the listener to view will not receive the delete

And if there is a modify:
* if both the previous record and the new record link to an existing counterparty, nothing changes
* if the previous record was linked to an invalid counterparty and the new record links to a valid counterparty, it will transform the modify to an insert – because the record has moved into the view
* if the previous record linked to a valid counterparty, but no longer does after the update, it becomes a delete


### Subscribe parameters
Subscribe supports the following parameters:

* `delay`: `Int` the listener will batch updates every x milliseconds
* `fields`: `Set<String>` filters `ModifyResult` on fields
* `subscribeLocally`: `Boolean` only publish updates that are local to the node

#### Overloads

The rx entity db takes a `Class<E>`, whereas the async entity db takes a `KClass<E>`.
Parameters marked with an asterisk(*) are optional.

1. `subscribe([KClass<E> / Class<E>], delay*, fields*, subscribeLocally*): Flow<E>`

These functions are available in kotlin only:

2. `subscribe<E>(delay*, fields*, subscribeLocally*): Flow<E>`

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val subscription = launch {
    db.subscribe<Trade>()
        .collect { update ->
            println("Received a trade update! $update")
        }
}
```

</TabItem>
<TabItem value="java">

```java
final var subscription = db.subscribe(Trade.class)
        .subscribe(update -> {
            System.out.println("Received a trade update! " + update);
        });
```
</TabItem>
</Tabs>

### Bulk subscribe

The `bulkSubscribe` combines a `getBulk` and a `subscribe` call into a single function. This operation is useful when
a class needs to read a full table and then receive updates of changes to the underlying table or view. 

This operation supports backward joins for views. This means that it can receive updates to the
root table and the joined tables. The view needs to support this in the definition, and it must be enabled
on the `bulkSubscribe` call.

`bulkSubscribe` supports the following parameters:

* `delay`: `Int` the listener will batch updates every x milliseconds
* `fields`: `Set<String>` filters `ModifyResult` on fields
* `index`: `UniqueEntityIndex<E>` the index to use for the `getBulk` part of the call
* `subscribeLocally`: `Boolean` only publish updates local to the node
* `backwardJoins`: `Boolean` enable backward joins in views

#### Overloads

Parameters marked with an asterisk(*) are optional.

1. `bulkSubscribe([Class<E> / KClass<E>], fields*, delay*, index*, subscribeLocally*, backwardJoins*) : Flow<Bulk<E>>`

These functions are available in kotlin only:

2. `bulkSubscribe<E>(fields*, delay*, index*, subscribeLocally*, backwardJoins*) : Flow<Bulk<E>>`

### Range subscribe

Range subscribe is like bulk subscribe, but it combines a `getRange` with `subscribe`. This operation is useful when
a class needs to read part of a table or view and then keep updated of any changes. The range will be applied to the `subscribe`
as well. As such, the update type will reflect whether a row comes into the range or moves out of the range, rather
than what happened in the database. This means that a `ModifyResult<E>` might be converted to an `InsertResult<E>` or a
`DeleteResult<E>`.

Furthermore, `rangeSubscribe` can take a static range (for example, all USD trades) or a dynamic range (for example, all trades booked
within the last 2 hours). The dynamic range will be updated on a schedule, either at an interval or at a time.

#### Overloads

`rangeSubscribe` supports the following parameters:

* `delay`: `Int` the listener will batch updates every x milliseconds
* `numKeyFields`: `Int` the number of key fields to take into account for the range
* `fields`: `Set<String>` filters `ModifyResult` on fields
* `index`: `UniqueEntityIndex<E>` the index to use for the `getBulk` part of the call
* `subscribeLocally`: `Boolean` only publish updates local to the node
* `backwardJoins`: `Boolean` enable backward joins in views
* `updateFrequency`: `PalDuration` a schedule for updating dynamic ranges
* `rangeProvider`: `() -> EntityIndex<E>` a lambda providing a `EntityIndex<E>`, for use in dynamic ranges

#### Static range
* `rangeSubscribe(from: EntityIndex<E>, to: EntityIndex<E>, numKeyFields*, delay*, fields*, subscribeLocally*, backwardJoins*): Flow<Bulk<E>>`
* `rangeSubscribe(EntityIndex<E>, numKeyFields*, delay*, fields*, subscribeLocally*, backwardJoins*): Flow<Bulk<E>>`
* `rangeSubscribe(rangeProvider, rangeProvider, updateFrequency, numKeyFields*, delay*, fields*, subscribeLocally*, backwardJoins*): Flow<Bulk<E>>`
* `rangeSubscribe(rangeProvider, updateFrequency, numKeyFields*, delay*, fields*, subscribeLocally*, backwardJoins*): Flow<Bulk<E>>`
