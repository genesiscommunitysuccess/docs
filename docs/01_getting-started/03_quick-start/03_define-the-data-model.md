---
title: 'Define the data model'
sidebar_label: 'Define the data model'
id: define-the-data-model
---

Now you are ready to define the fields and tables that make up your data model. This structures information in a simple way that can be viewed by users and processed by the application.

Open Intellij (or your chosen IDE). In the alpha project, you will see the **readme** file for the project. After importing and indexing, your gradle tab (normally on the right of your window) should contain 3 folders (alpha, client, genesisproduct-alpha).

### Add fields
You define your fields in the file **alpha-fields-dictionary.kts**.



:::tip

Once the project is open, there are two easy ways to find this file quickly in Intellij:

- Press the **Shift** key twice, then type the name of the file you are looking for.
- Press **Shift** + **Ctrl** + **N**, then type the name of the file you are looking for.

:::


For our simple example, we shall add five fields:

```kotlin
fields {

    field("TRADE_ID", type = STRING)
    field("QUANTITY", type = INT)
    field("PRICE", type = DOUBLE)
    field("SYMBOL", type = STRING)
    field("DIRECTION", type = ENUM("BUY", "SELL", default = "BUY"))

}
```

After you have saved this file, run genesis-generated-fields.

From the Gradle menu on the right of Intellij, this is:

 **genesisproduct-alpha**/**alpha-dictionary-cache**/**genesis-generated-fields**/**Tasks**/**genesis**/**generateFields**

![](/img/build-gradle-kts-fields.png)

### Add a table
Now we have our fields, let's define a table in the file **alpha-tables-dictionary.kts**.

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

After you have saved this file, run genesis-generated-dao.

From the Gradle menu, this is:

**genesisproduct-alpha**/**alpha-dictionary-cache**/**genesis-generated-dao**/**Tasks**/**genesis**/**generateDAO**

![](/img/build-gradle-kts-generated-dao.png)

OK. You have now created your data model. You can now create the key modules that surround the database.