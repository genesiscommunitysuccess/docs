---
title: 'Quick start - define the data model'
sidebar_label: 'Define the data model'
id: define-the-data-model
keywords: [getting started, quick start, data model]
tags:
    - getting started
    - quick start
    - data model
---

Now you are ready to define the fields and tables that make up your data model. This model structures information in a simple way that can be viewed by users and processed by the application.

### Add fields
You define your fields in the file **alpha-fields-dictionary.kts**.


:::tip

Once the project is open, there are two easy ways to find this file quickly in IntelliJ:

- Press the **Shift** key twice, then type the name of the file you are looking for.
- Press **Shift** + **Ctrl** + **N**, then type the name of the file you are looking for.

:::


For your simple example, you shall add five fields:

```kotlin
fields {

    field("TRADE_ID", type = STRING)
    field("QUANTITY", type = INT)
    field("PRICE", type = DOUBLE)
    field("SYMBOL", type = STRING)
    field("DIRECTION", type = ENUM("BUY", "SELL", default = "BUY"))

}
```

You can find more information on fields in our [Database documentation](../../../database/fields-tables-views/fields/).

After you have saved this file, run genesis-generated-fields from the Gradle menu on the right of Intellij, this is:

 **genesisproduct-alpha**/**alpha-dictionary-cache**/**alpha-generated-fields**/**Tasks**/**genesis**/**generateFields**

![](/img/build-gradle-kts-fields.png)

Alternatively, you can run the Gradle tasks from the command line.  

```shell title='Running generateFields from the command line'
./gradlew :genesisproduct-alpha:alpha-dictionary-cache:alpha-generated-fields:generateFields
```

### Add a table
Now you have your fields, let's define a table in the file **alpha-tables-dictionary.kts**.

You are defining one single table, containing all your fields.

TRADE_ID is the primaryKey, which will be auto-generated.

```kotlin
tables {

    table (name = "TRADE", id = 2000) {
        sequence(TRADE_ID, "TR")
        QUANTITY
        PRICE
        SYMBOL
        DIRECTION

        primaryKey {
            TRADE_ID
        }
    }
    
}
```

You can find more information on tables [here](../../../database/fields-tables-views/tables/).

After you have saved this file, run genesis-generated-dao from the Gradle menu, this is:

**genesisproduct-alpha**/**alpha-dictionary-cache**/**genesis-generated-dao**/**Tasks**/**genesis**/**generateDao**

![](/img/build-gradle-kts-generated-dao.png)


```shell title='Running generateDAO f   rom the command line'
./gradlew :genesisproduct-alpha:alpha-dictionary-cache:alpha-generated-dao:generateDao
```

Now that that has been done, you can create the key modules that surround the database.