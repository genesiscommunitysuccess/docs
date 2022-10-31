---
title: Postgres data pipeline - Create Genesis Dictionary
sidebar_label: Create Genesis Dictionary
sidebar_position: 2
id: dictionary
keywords: [getting started, quick start, postgres data pipeline, dictionary]
tags:
    - getting started
    - quick start
    - postgres data pipeline
    - dictionary
---

## Create new Genesis project
At this point you should have `genx` installed on your machine. If you don't, then follow this [guide](/getting-started/prerequisites/genx/) to set it up.

Use `genx` to create new blank project following the instructions [here](/getting-started/quick-start/create-a-new-project/). For the rest of the tutorial `datapipeline-trades` will be used for project name but feel free to choose any name you like.

## The Genesis data model

Now following the steps [here](/getting-started/quick-start/define-the-data-model/) we'll define our data model. Don't forget that the project name is `datapipeline-trades` (or the one you chose). The model for the application is the following:

A trade has:
- `TRADE_ID` of type `STRING`
- `INSTRUMENT_ID` of type `STRING`
- `PRICE` of type `DOUBLE`
- `QUANTITY` of type `INT`
- `SIDE` of type `ENUM` with possible values `BUY` and `SELL`
- `TRADE_DATE` of type `DATE`
- `TRADE_DATETIME` of type `DATETIME`
- `ENTERED_BY` of type `STRING`
- `TRADE_STATUS` of type `ENUM` with possible values `NEW`, `MODIFIED` and `CANCELLED`
- `UNSOLICITED` of type `BOOLEAN`
- `PREV_TRADE_ID` of type `STRING`

An alternate trade has:
- `TRADE_ID` of type `STRING`
- `ALTERNATE_TYPE` of type `STRING`
- `TRADE_CODE` of type `STRING`

An instrument has:
- `INSTRUMENT_ID` of type `STRING`
- `INSTRUMENT_NAME` of type `STRING`

An alternate instrument has:
- `INSTRUMENT_ID` of type `STRING`
- `ALTERNATE_TYPE` of type `STRING`
- `INSTRUMENT_CODE` of type `STRING`

To define that model first start with the fields. Open `datapipeline-trades-fields-dictionary.kts` under `datapipeline-sandbox/server/jvm/datapipeline-trades-config/src/main/resources/cfg` (if you chose another project name don't forget to replace `datapipeline-trades` with it) and enter the following:

```kotlin
fields {
    field(name = "TRADE_ID", type = STRING)
    field(name = "INSTRUMENT_ID", type = STRING)
    field(name = "PRICE", type = DOUBLE)
    field(name = "QUANTITY", type = INT)
    field(name = "SIDE", type = ENUM("BUY", "SELL", default = "BUY"))
    field(name = "TRADE_DATE", type = DATE)
    field(name = "TRADE_DATETIME", type = DATETIME)
    field(name = "ENTERED_BY", type = STRING)
    field(
        name = "TRADE_STATUS", type = ENUM(
            "NEW", "MODIFIED", "CANCELLED", 
            default = "NEW"
        )
    )
    field(name = "UNSOLICITED", type = BOOLEAN, default = false)
    field(name = "PREV_TRADE_ID", type = STRING)
    field(name = "ALTERNATE_TYPE", type = STRING)
    field(name = "TRADE_CODE", type = STRING)
    field(name = "INSTRUMENT_NAME", type = STRING)
    field(name = "INSTRUMENT_CODE", type = STRING)
}
```

After you have saved this file, run **genesis-generated-fields**.

From the Gradle menu on the right of IntelliJ, this is:

 **genesisproduct-datapipeline-trades**/**datapipeline-trades-dictionary-cache**/**genesis-generated-fields**/**Tasks**/**genesis**/**generateFields**

 ![](/img/build-gradle-kts-fields.png)

The build step will generate the fields that can be referenced from the tables and data pipelines configuration.

You can find more information on Fields [here](/database/fields-tables-views/fields-tables-views/).

The next step is to add the relevant [Fields](/database/fields-tables-views/fields/) to [Tables](/database/fields-tables-views/tables/). Open `datapipeline-trades-tables-dictionary.kts` under `datapipeline-trades/server/jvm/datapipeline-trades-config/src/main/resources/cfg` (if you chose another project name don't forget to replace `datapipeline-trades` with it) and enter the following:

```kotlin
tables {
    table(
        name = "TRADE", id = 11000, audit = details(
            id = 11001, sequence = "TR",
            tsKey = true
        )
    ) {
        sequence(TRADE_ID, "TR")
        INSTRUMENT_ID not null
        PRICE not null
        QUANTITY not null
        SIDE not null
        TRADE_DATE
        TRADE_DATETIME
        ENTERED_BY
        TRADE_STATUS
        UNSOLICITED
        PREV_TRADE_ID
        primaryKey {
            TRADE_ID
        }
    }
    table(name = "ALT_TRADE_ID", id = 11002) {
        TRADE_ID
        ALTERNATE_TYPE
        TRADE_CODE
        primaryKey {
            TRADE_ID
            ALTERNATE_TYPE
        }
        indices {
            unique(name = "ALT_TRADE_ID_BY_CODE") {
                TRADE_CODE
                ALTERNATE_TYPE
            }
        }
    }
    table(name = "INSTRUMENT", id = 11003) {
        sequence(INSTRUMENT_ID, "IN")
        INSTRUMENT_NAME
        primaryKey {
            INSTRUMENT_ID
        }
    }
    table(name = "ALT_INSTRUMENT_ID", id = 11004) {
        INSTRUMENT_ID
        ALTERNATE_TYPE
        INSTRUMENT_CODE
        primaryKey {
            INSTRUMENT_ID
            ALTERNATE_TYPE
        }
        indices {
            unique(name = "ALT_INSTRUMENT_ID_BY_CODE") {
                INSTRUMENT_CODE
                ALTERNATE_TYPE
            }
        }
    }
}
```

After you have saved this file, run **genesis-generated-dao**.

From the Gradle menu, this is:

**genesisproduct-datapipeline-trades**/**datapipeline-trades-dictionary-cache**/**genesis-generated-dao**/**Tasks**/**genesis**/**generateDAO**

![](/img/build-gradle-kts-generated-dao.png)

The build step will generate the tables definitions along with data access objects (DAO) that will be referenced from the data pipeline configuration.

You can find more information on Tables [here](/database/fields-tables-views/fields-tables-views/).
