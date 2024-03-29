---
title: 'Data types - Table entities'
sidebar_label: 'Table entities'
id: table-entities
keywords: [database, data types, table entities]
tags:
    - database
    - data types
    - table entities
---



import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


Table entities are classes generated by Genesis that match your applications's [data model](../../../database/fields-tables-views/fields-tables-views/). The generated entity name is based on the table name, but will be camel case. 

For example, `TABLE_NAME` becomes `TableName`. 

All table/view entities implement a common interface called [DbEntity](../../../database/data-types/dbentity/).

## Index entities

Tables, like views, have [index entities](../../../database/data-types/index-entities/). There are also convenient methods that construct an index entity from the table entity. `byPrimaryKey()` will return an entity for the primary key. Additionally, for each index, there will be a `by...()` call with the index name.

## Builder

All table entities come with builders to help construct these objects. In Kotlin, the builder works as a lambda in which the field values are set, and the object is built after the lambda call is completed. In Java, the builder is a fluent interface, where fields are set and the object is built in a final `build` call.

Just before the object is built, the object is validated to make sure all [required fields](../../../database/fields-tables-views/fields/) have been set.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val trade = Trade {
    tradeId = id
    tradeType = type
    tradeDate = DateTime.now()
    currencyId = "USD"
    quantity = 500
    price = 2.0
}
```
</TabItem>
<TabItem value="java">

```java
Trade trade = Trade.builder()
    .setTradeType(tradeType)
    .setTradeId(tradeId)
    .setTradeDate(now())
    .setCurrencyId("USD")
    .setQuantity(50)
    .setPrice(2.0)
    .build();
```
</TabItem>
</Tabs>

## Auditable tables

When a table is audited, the table entity can be easily converted to its audited counterpart by calling the `toAuditEntity` function.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val tradeAudit = trade.toAuditEntity(
    auditEventType = "trade modify"
    auditEventDatetime = DateTime.now(),
    auditEventText = "trade was modified in event",
    auditEventUser = user,
)
```
</TabItem>
<TabItem value="java">

```java
TradeAudit = trade.toAuditEntity(
    "trade modify"
    DateTime.now(),
    "trade was modified in event",
    user
);
```
</TabItem>
</Tabs>


## Some of the most useful methods

```markup
| Name | Signature | Description |
| --- | --- | --- |
| byPrimaryKey | `fun byPrimaryKey(): UniqueEntityIndex<*, *>` | gets entity by primaryKey |
| by{indexField} | `fun by{indexField}(): By{indexField}` | gets entity by index fields |
| toString | fun toString(): String | gets the string representation of the view with sensitive fields masked (for example, passwords) |
| toStringWithSensitivesUnmasked | `fun toStringWithSensitivesUnmasked(): String` | gets the string representation of view with sensitive fields(Ex: Password) unmasked |
| set | `operator fun <T> set(field: TableField<*, T>, value: T?)` | to set table field with provided value |
```

## Examples

Given the following table definition, declared as described [here](../../../database/fields-tables-views/tables/), the platform will generate table entities as shown in the examples.

```kotlin
table(name="CUSTOMER", id = 11002) {
  CUSTOMER_NAME
  CUSTOMER_ADDRESS
  COUNTRY
  CUSTOMER_PASSWORD sensitive "XXXXXX"
  primaryKey {
    CUSTOMER_NAME
  }
}
```

Examples:

```kotlin
val customer = Customer {
  customerName = "Customer_1"
  customerPassword = "PASSWORD"
  customerAddress = "London"
  country = "UK"
}

customer.toGenesisSet(listOf("CUSTOMER_NAME"))
// Output: CUSTOMER_NAME = Customer_1

customer.toGenesisSetFormatted(listOf(ColumnConfig.Field.Aliased("COUNTRY", "CUSTOMER_COUNTRY")))
// Output: CUSTOMER_COUNTRY = UK

customer.toString()
// Output: Customer{serialVersionUID='1', customerName=Customer_1, customerAddress=London, country=UK, customerPassword=XXXXXX, recordId={not-set}, timestamp={not-set}}

customer.toStringWithSensitivesUnmasked()
// Output: Customer{serialVersionUID='1', customerName=Customer_1, customerAddress=London, country=UK, customerPassword=PASSWORD, recordId={not-set}, timestamp={not-set}}

customer.get(CUSTOMER.CUSTOMER_ADDRESS)
// Output: London

customer.set(CUSTOMER.CUSTOMER_ADDRESS, "Manchester")
```