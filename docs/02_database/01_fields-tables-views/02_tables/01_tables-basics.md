---
title: 'Tables - basics'
sidebar_label: 'Tables - basics'
id: tables-basics
keywords: [database, tables, primary key, index, indices, nonunique index, unique index]
tags:
    - database
    - tables
    - primary key
    - index
    - indices
    - nonunique index
    - unique index

---

 

In your application's **tables-dictionary.kts** file, you need to define every table that your application needs. Let us look at a very simple example definition. This contains a single table with three fields in it.

Then you can look closer at all the elements that can go into a table definition.

```kotlin
tables {

  table(name = "POSITION", id = 11002) {
      autoIncrement(POSITION_ID)
      INSTRUMENT_ID
      QUANTITY
      NOTIONAL

      primaryKey { 
        POSITION_ID
      }
  }

}
```

The `autoIncrement` keyword is used to set this field automatically to the next number in the sequence when a new record is written to the database. We shall discuss this further in the [Advanced](../../../../database/fields-tables-views/tables/tables-advanced/) page.

## Table name

When you define a table, you must start by giving it a name that is unique to the application: 


```kotlin
  table(name = "POSITION")
```

## Table ID

Tables must also be given a Table ID that is unique to the application. This ensures that you can rename a table without losing the data in it.
 
```kotlin
  table(name = "POSITION", id = 11002)
```

## Fields
After specifying a name and a Table ID, specify the fields in the table. 

You do not need to specify field types and other attributes - just the field name.

If you are using intelliJ IDE, it will auto-suggest the available fields; any references that are not known will be shown in red.


```kotlin

  table(name = "POSITION", id = 11002) {
      autoIncrement(POSITION_ID)
      INSTRUMENT_ID
      QUANTITY
      NOTIONAL

  }

```

## Primary key

A table must have a single primary key.

It is common to use a single sequenced/autoIncrement field in the table as a `primaryKey`.

The `primaryKey` needs to contain one or more fields in the table. Where using more than one field, the order of the fields matters in the case of wanting to search performantly based on a partial key.

The example below shows a `primaryKey` with a single field: `POSITION_ID`:

```kotlin
tables {

  table(name = "POSITION", id = 11002) {
      autoIncrement(POSITION_ID)
      INSTRUMENT_ID
      QUANTITY
      NOTIONAL
      
      primaryKey {
          POSITION_ID 
      }
  }

}
```

## Indices

An index (plural: indices) provides a way of querying the data in your table. Every table must have at least one way of querying the data, and that is the primary key.

In many cases, you will want to provide other indices so that all the useful ways of looking at the table are made possible.

There are two types of index that you can specify:

- A **unique index** ensures that no two records in the table can have the same value for the specified field or fields. For example, this could be a TRADE_ID in a TRADES table, where the unique value is generated via autoIncrement or sequence. Or it could be a CURRENCY_SYMBOL in a table of CURRENCIES.  
- A **non-unique index** is useful when uniqueness is not important or not possible. For example, you could add a non-unique index on the ORDER_ID field in your TRADE table. This enables you to find all the trades that match a specified order.  (ORDER_ID would be unique in the ORDERS table, but the order can be filled by multiple trades.) 

Here is a simple example showing a unique and a non-unique index.  Each index has only one field.

```
  table(name = "TRADE", id = 1010) {
      autoIncrement(TRADE_ID)
      INSTRUMENT_ID
      TRADE_TYPE
      TRADE_DATE
      CURRENCY_ID
      QUANTITY
      PRICE
      
      primaryKey {
          TRADE_ID 
      }
      indices {
          unique {
                   INSTRUMENT_ID
          }
          nonUnique {
                   CURRENCY_ID
          }
      }
 }

}
```

See our page on [operations and indices](../../../../database/data-structures/indices/) for information on the operations that can be used to perform look-ups on an index.

### Enforcing uniqueness
We have already noted that a unique index enforces uniqueness on that field. So you can add a unique index to a table to create a further constraint on the primary index.

Imagine a scenario where you have projects and users.

- You have a PROJECTS table where each project has a unique PROJ_ID.
- You have a USERS table where each project has a unique USER_ID.

There is a many-to-many relationship between the two tables - projects can have more than one user, and users can belong to more than one project. To allocate users to projects, you need a third table: PROJECT_USERS.

In the the PROJECT_USERS table, you only need two fields:

- PROJ_ID
- USER_ID

Each record in this table states that PROJ_ID = x has USER_ID = y. However, we require that each unique combination of PROJ_ID and USER_ID can only occur once in the table. So in our table, we define the primary key on PROJ_ID and USER_ID. We can rely on the database to ensure uniqueness; an attempt to insert a record with a PROJ_ID and USER_ID combination that already exists will fail.

Here is our table definition for this:

```kotlin
  table(name = "PROJECT_USERS", id = 11020) {
      PROJ_ID
      USER_ID
      primaryKey {
          PROJ_ID
      }
     indices {
         unique {
             PROJ_ID
             USER_ID
         }
         nonUnique {
             USER_ID
         }
     }
  }
```
You can clearly see the unique index on the two fields in the table above. As well as enforcing uniqueness, it also enables you to search for a record where USER_ID=y and USER_ID=y - so you can see if project x includes user y (and you can also make a partial search - see below).

Note that the example also includes a non-unique index on USER_ID. This enables you to search for all records where USER_ID=y - so you can see exactly which projects the user belongs to.

### Indices with multiple fields
Any index you create - the primary key or other unique or non-unique indices - can have multiple fields.

If you create an index with multiple fields, it is possible to make a search based on all the fields specified or to make a partial search based on some of the fields. However, there are strict limits to this.

Consider an index that has three fields; A, B and C:

- The search **must** always use the first field: A. It is also possible to search only on this field.
- The search **can** use all the fields. The field values must be specified in the order that they are specified in the index.
- The search **can** use the first and second fields only: A and B.
- The search **cannot** use the first and third fields (A and C) only.
- The search **cannot** use the second and third fields (B and C) only.

Bear these restrictions in mind when you create an index with multiple fields; the order of the fields is important if you want partial searches to be useful and efficient.

When you define an index, you cannot supply exactly the same fields in exactly the same order as the primary key or another index on the same table.

### Primary key and index names

It is not mandatory to give a name to a primary key or an index. If you don't provide a name, it will be inferred:

 `[TABLE_NAME]_BY_[FIELD_1](_[FIELD_N])`
 
 where FIELD_1 - FIELD_N are all the fields that make up the key/index in the order specified.

One exception is the common use case where the primary key is made up of a single field with a name of format `[TABLE_NAME]_[ID]`. In this case, the inferred name is `[TABLE_NAME]_BY_ID`.

Let's see some examples. Below, the table name is `POSITION`. The inferred names are shown in the comment before each primary key.


```kotlin
    
    //POSITION_BY_ID
    primaryKey { 
        POSITION_ID
    }

    //POSITION_BY_OTHER_FIELD
    primaryKey { 
        OTHER_FIELD
    }
    
    //POSITION_BY_POSITION_ID_OTHER_FIELD_ANOTHER_FIELD
    primaryKey { 
        OTHER_FIELD
        ANOTHER_FIELD
    }
```

In this example, we have specified the name of the primary key in the `name` parameter.

```kotlin
    primaryKey(name = "POSITION_PRIMARY_KEY") {
      POSITION_ID
    }
```

Indices work the same way; either you specify the name in the `name` parameter or the name will be automatically inferred.
