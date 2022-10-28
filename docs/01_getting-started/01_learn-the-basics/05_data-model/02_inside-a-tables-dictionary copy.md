---
title: 'Data model - Inside a tables dictionary'
sidebar_label: 'Inside a tables dictionary'
id: inside-a-tables-dictionary
keywords: [getting started, basics, data, model, tables dictionary]
tags:
    - getting started
    - basics
    - data model
    - tables dictionary
---

Tables of data will be critical to your application, from simple tables of currencies or locations to more complex ones that contain trade or order information (for example).

The tables dictionary is where you specify all the tables you need for your data model.

This is all contained in a single Kotlin script file. If your application is called bravo, then the file would be called **bravo-tables-dictionary.kts**.

Within the file, you simply need to specify the details of each table that you need.  The essential things you need to specify are:

- the name of the table
- a numeric id for the table (very useful, because it means you can change the name later, if necessary)
- the fields that belong in the table
- the primary key for the table, which is essentially the field that it will be indexed by

Of course, all the fields you specify must be in your fields dictionary.

Here is a short and very simple example, which specifies one single table with four fields: 

```kotlin
tables {

  table( name= "POSITION", id = 11002) {
    POSITION_ID
    INSTRUMENT_ID
    QUANTITY
    NOTIONAL

    primaryKey {
     POSITION_ID
    }
  }
}
```
Things can get much more complex than that. Most applications contain a lot of tables to hold their data. And the tables themselves can be more complex. But, you have just seen the basics.



