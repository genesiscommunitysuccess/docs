---
title: 'DbRecord'
sidebar_label: 'DbRecord'
id: dbrecord
---



:::warning
Using `DbRecord` instead of entities will circumvent compile-time validation of database interactions. This means that errors might not appear until runtime or might lead to unexpected results.
:::

`DbRecord` enables you to build a record of a specified table. It is not type-safe, so this is not our recommended method.

## Constructors

| Signature | Description                                                                                                                                                                |
|---|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `constructor(tableName: String)` | Create record with specified table name.                                                                                                                                   |
| `constructor(source: DbRecord?)` | Clone existing record.                                                                                                                                                    |
| `constructor(targetTableName: String, source: DbRecord?)` | Clone an existing record into another record belonging to a different table. This is useful when the target table record is the extended table of the source record. |

Example
```kotlin
val tradeRecord = DbRecord("TRADE")

val clonedTradeRecord = DbRecord(tradeRecord)

DbRecord("TRADE_SUMMARY", tradeRecord)
```

## functions

Use the functions below to set and get fields of `DbRecord`. The field type can be any of these [types](/database/fields-tables-views/fields/fields-basics/#field-types).

### Set record
`fun set{DataType}(column: String, value: {DataType}?)` You need to specify name and value of the column. `DataType` represents the type of the field you are trying to set.
If you are trying to set a Double field, the method would look like this: `fun setDouble(column: String, value: Double?)`; the value needs to be non-null.

### Get record
`fun get{DataType}(column: String): {DataType}?`    You need to specify the name of the column. `DataType` represents the type of the field you are trying to get.
If you are trying to get a Double field, the method would look like this: `fun getDouble(column: String): Double?`, it returns value if present, otherwise null.

### Generic getter and setter
`fun getObject(column: String): Any?`   Generic access to fields. Returns value if present, otherwise null.

`fun setObject(column: String, value: Any?)`    Generic setter for fields.

##  Other useful functions and properties

`fun differenceInFields(comparatorRecord: DbRecord): Collection<String>`    This function compares the difference in fields between two records in the same table. It identifies the fields that have different values. Fields with the same values are ignored. If you try to compare fields from different tables, this returns an error.

**Example**
```kotlin
// gives the fields which differ in their values
dbRecord.differenceInFields(dbRecord2)
```

`isEmpty`   This property identifies whether there is any content within the `DbRecord`. It returns `true` if there is no information collected within this record, otherwise, it returns `false`.

`columns`   This property gets all columns for this record.

`tableName` This property gets the table name of record.
