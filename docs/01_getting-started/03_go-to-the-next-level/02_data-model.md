---
title: 'Go to the next level - Define the data model using fields, tables and views'
sidebar_label: 'Fields, tables and views'
id: data-model
keywords: [getting started, quick start, next level, data model, fields, tables, views]
tags:
    - getting started
    - quick start
    - next level
    - introduction
    - data model
    - fields
    - tables
    - views
---

Following on from project creation in the previous step, you have:

```
i Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```

Now you are ready to define the fields and tables that make up the data model. 

Start IntelliJIDEA (or your chosen IDE) and then open the `positions-app-tutorial` project. This triggers importing and indexing of the files (which takes about as long as [Hotel California](https://youtu.be/jVHhV3A5C5c), so be patient). After that, you will see the files and the project structure displayed in your IDE.

## Section objectives
The goal of this section is to define and build our database fields, tables and views.


## 1. Add fields
The fields are defined in the file **positions-app-tutorial-fields-dictionary.kts**

:::tip

Once the project is open, there are two easy ways to find this file quickly in IntelliJIDEA:

- Press the **Shift** key twice, then type the name of the file you are looking for.
- Press **Shift** + **Ctrl** + **N**, then type the name of the file you are looking for.

:::

For this application, we need fields that model a Trade, Position and Company; to do that, we'll add the following:

```kotlin
fields {
    // Trade
    field(name = "ENTERED_BY", type = STRING)
    field(name = "PRICE", type = DOUBLE)
    field(name = "QUANTITY", type = LONG)
    field(name = "REFERENCE_PX", type = STRING)
    field(name = "REFERENCE_QTY", type = DOUBLE)
    field(name = "SIDE", type = STRING)
    field(name = "SYMBOL", type = LONG)
    field(name = "TRADE_DATE", type = DATE)
    field(name = "TRADE_DATETIME", type = DATETIME)
    field(name = "TRADE_ID", type = STRING)
    field(name = "TRADE_STATUS", type = ENUM("NEW", "ALLOCATED", "CANCELLED", default = "NEW"))

    // Position
    field(name = "POSITION_ID", type = STRING)
    field(name = "QUANTITY", type = LONG) // total number of shares
    field(name = "VALUE", type = DOUBLE) // position qty multiplied by avg trade price
    field(name = "NOTIONAL", type = DOUBLE) // instrument price multiplied by quantity
    field(name = "PNL", type = DOUBLE) // difference between notional and current market price

    // Company
    field(name = "COMPANY_NAME", type = STRING)
    field(name = "COMPANY_LOCATION", type = STRING)

    // Instrument
    field(name = "INSTRUMENT_ID", type = STRING)
    field(name = "INSTRUMENT_SYMBOL", type = STRING)
    field(name = "CURRENCY_ID", type = STRING)

    // Counterparty
    field(name = "COUNTERPARTY_NAME", type = STRING)
    field(name = "COUNTERPARTY_ID", type = STRING)
}
```

### Generate the fields
After you have saved this file, run `generateFields`.

From the Gradle menu on the right of Intellij, this is:

**genesisproduct-positions-app-tutorial**/**positions-app-tutorial-dictionary-cache**/**genesis-generated-fields**/**Tasks**/**genesis**/**generateFields**

![](/img/build-gradle-kts-fields-positions.png)

:::note Why do I have to run this Gradle task?

You are editing a kts file that will be compiled and built for use in other places. In this case, we want the fields to be available to the tables (and with intellisense support from the IDE).

As we go, you'll see we have different Gradle tasks, depending on the artifact we want to build.
:::

## 2. Add tables
Now that we have our fields, let's define the tables in the file **positions-app-tutorial-tables-dictionary.kts**.
We shall define four tables, `TRADE`, `POSITION`, `COUNTERPARTY` and `INSTRUMENT`:

```kotlin
tables {
    table (name = "TRADE", id = 11000) {
        sequence(TRADE_ID, "TR")
        INSTRUMENT_ID not null
        COUNTERPARTY_ID not null
        QUANTITY not null
        SIDE not null
        PRICE not null
        TRADE_DATETIME
        ENTERED_BY
        TRADE_STATUS

        primaryKey {
            TRADE_ID
        }
    }

    table(name= "POSITION", id = 11001) {
        sequence(POSITION_ID, "PS")
        INSTRUMENT_ID not null
        QUANTITY
        NOTIONAL
        VALUE
        PNL

        primaryKey {
            POSITION_ID
        }

        indices {
            unique {
                INSTRUMENT_ID
            }
        }
    }

    table( name = "COUNTERPARTY", id = 11003) {
        COUNTERPARTY_ID
        COUNTERPARTY_NAME

        primaryKey {
            COUNTERPARTY_ID
        }
    }

    table (name = "INSTRUMENT", id = 11004) {
        INSTRUMENT_ID
        INSTRUMENT_SYMBOL
        CURRENCY_ID

        primaryKey {
            INSTRUMENT_ID
        }
    }
}
```

### Generate the data objects
After you have saved the file of tables, run `generateDao`

From the Gradle menu, this is:

**genesisproduct-positions-app-tutorial**/**positions-app-tutorial-dictionary-cache**/**genesis-generated-dao**/**Tasks**/**genesis**/**generateDAO**

![](/img/build-gradle-kts-generated-dao-positions.png)

This script generates the DAOs (data repos) from the tables, and they are available to be imported in your code.

:::tip
As we previously generated the fields, autocompletion helps you to define the tables more quickly, and with fewer errors. Also note that Genesis provides several autogenerated primary keys: **sequence**, **uuid**, **autoincrement**.
:::

## 3. Add view

When you set up a data model, it implies relationships between tables. For example, a `TRADE` has a `COUNTERPARTY_ID` and an `INSTRUMENT_ID`. That means it has a relationship with the `COUNTERPARTY` and `INSTRUMENT` tables.

Views enable you to join related tables to create a single holistic view.

In short, views are the Genesis equivalent of SQL select queries. Unlike tables, views do not have any data of their own, they are read-only, but they present a view based on one or more tables. 

A view always starts with a single table, the root table. Other tables can be joined onto the root table to present composite data. 

Views are very powerful and here we are going to cover just the basics. When you have a chance, have a look at the [documentation](/database/fields-tables-views/views/).

The code below creates a view called `TRADE_VIEW`, which joins the `TRADE` table to the `INSTRUMENT` and `COUNTERPARTY` tables. Edit **positions-app-tutorial–view-dictionary.kts** file and add the view on the `TRADE` table:

```kotlin
views {

    view("TRADE_VIEW", TRADE) {

        joins {
            joining(COUNTERPARTY) {
                on(TRADE.COUNTERPARTY_ID to COUNTERPARTY { COUNTERPARTY_ID })
            }
            joining(INSTRUMENT) {
                on(TRADE.INSTRUMENT_ID to INSTRUMENT { INSTRUMENT_ID })
            }
        }

        fields {
            TRADE.allFields()

            COUNTERPARTY.COUNTERPARTY_NAME withPrefix COUNTERPARTY
            INSTRUMENT.INSTRUMENT_SYMBOL withPrefix INSTRUMENT
            INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"
        }
    }
}
```

### Generate the view
After you have saved the view file, run `generateView`

From the Gradle menu, this is:

**genesisproduct-positions-app-tutorial**/**positions-app-tutorial-dictionary-cache**/**genesis-generated-view**/**Tasks**/**genesis**/**generateView**

![](/img/build-gradle-kts-generated-view-positions.png)

<!-- Run **positions-app-tutorial-config:assemble** to make the view ready for use. -->

## Entities

During code generation, [view](/database/data-structures/views/) and [index entities](/database/data-structures/indices/) will be generated from the definitions in your application's **view-dictionary.kts** file. The name of each entity will be the same as the definition, but it is converted from snake case to camel case; for example, VIEW_NAME becomes ViewName.


## Conclusion
With this, our data model is defined. As a next step, we shall add some data to the tables in the database.

