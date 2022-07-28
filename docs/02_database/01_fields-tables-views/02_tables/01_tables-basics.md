---
title: 'Tables - basics'
sidebar_label: 'Tables - basics'
id: tables-basics
---

[Introduction](/database/fields-tables-views/tables/)  | [Basics](/database/fields-tables-views/tables/tables-basics/) |  [Advanced](/database/fields-tables-views/tables/tables-advanced/) | [Examples](/database/fields-tables-views/tables/tables-examples/) 

In your application's **tables-dictionary.kts** file, you need to define every table that your application needs. Let us go back to the very simple example definition that we started with. This contains a single table with three fields in it.

Then you can look closer at all the elements that can go into a table definition.

```kotlin
tables {

  table( name= "POSITION", id = 11002) {
    sequence(POSITION_ID, "PS")
    INSTRUMENT_ID
    QUANTITY
    NOTIONAL

    primaryKey {
     POSITION_ID
    }
  }

}
```



## Table name

When you define a table, you must start by giving it a name that is unique to the application: 


```kotlin
  table( name= "POSITION")
```

## Table ID

Tables must also be given a Table ID that is unique to the application. This ensures that you can rename a table without losing the data in it.
 
```kotlin
  table( name= "POSITION", id = 11002)
```

## Fields
After specifying a name and a Table ID, specify the fields in the table. 

You do not need to specify field types and other attributes - just the field name.

If you are using intelliJ IDE, it will auto-suggest the available fields; any references that are not known will be shown in red.


```kotlin

  table( name= "POSITION", id = 11002) {
    sequence(POSITION_ID, "PS")
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

  table( name= "POSITION", id = 11002) {
    sequence(POSITION_ID, "PS")
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

Indices are used in the following scenarios:

- Creating additional unique constraints to the table's primary key
- Providing a performant record lookup (`unique` index)
- Providing an index for a performant ranged lookup (`nonUnique` index, else `unique` index but searching on part of the key)

You can define indices on a table in a similar fashion to `primaryKey`. As with keys, indices are made up of one or more fields from the table. Where the indices are made up of multiple fields, the order of the fields matters if you want to search based on a partial index. This affects performance.

```kotlin
    indices {
        unique {
            SESSION_AUTH_TOKEN
        }
        nonUnique {
            USER_NAME
        }
    }
```

When you define an index, you cannot supply exactly the same fields in exactly the same order as the primary key or another index on the same table.

### Primary key and index names

It is not mandatory to give a primary key or an index a name. If you don't provide a name, it will be inferred:

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
    primaryKey(name = "POSITION_PRIMARY_KEY" ) {
     POSITION_ID
    }
```

Indices work the same way; either you specify the name in the `name` parameter or the name will be automatically inferred.



