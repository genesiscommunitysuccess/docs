---
title: 'Define the data model'
sidebar_label: 'Define the data model'
id: define-the-data-model
---

Now you are ready to define the fields and tables that make up your [data model](/creating-applications/defining-your-application/data-model/data-model-overview). This structures information in a simple way that can be viewed by users and processed by the application.

Open Intellij (or your chosen IDE). In the alpha project, you will see the **readme** file for the project. After importing and indexing, you should see the fol

### Add fields
You define your [fields](/creating-applications/defining-your-application/data-model/fields/fields/) in the file **alpha-fields-dictionary.kts**.



:::tip

Once the project is open, there are two easy ways to find this file quickly in Intellij:

- Press the **Shift** key twice, then type the name of the file you are looking for.
- Press **Shift** + **Ctrl** + **N**, then type the name of the file you are looking for.

:::


For our simple example, we will add five fields:

```kotlin
fields {

    field("TRADE_ID", type = STRING)
    field("QUANTITY", type = INT)
    field("PRICE", type = DOUBLE)
    field("SYMBOL", type = STRING)
    field("DIRECTION", type = ENUM("BUY", "SELL", default = "BUY"))

}
```

After you have saved this file, run [genesis-generated-fields](/reference/developer/genesis-dao/#dao-generation-commands).

From the Gradle menu on the right of Intellij, this is:

 **genesisproduct-alpha**/**alpha-dictionary-cache**/**Tasks**/**genesis-generated-fields**/**Tasks**/**generateFields**

![](/img/build-gradle-kts-fields.png)

### Add a table
Now we have our fields, let's define a [table](/creating-applications/defining-your-application/data-model/tables/tables) in the file **alpha-tables-dictionary.kts**.

We are defining one single table, containing all our fields.

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

After you have saved this file, run [genesis-generated-dao](/reference/developer/genesis-dao/#dao-generation-commands).

From the Gradle menu, this is:

**genesisproduct-alpha**/**alpha-dictionary-cache**/**Tasks**/**genesis-generated-dao**/**Tasks**/**generateDAO**

<!-- ![](/img/build-gradle-kts-generated-dao.png) -->
