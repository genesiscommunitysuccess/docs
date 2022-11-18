---
title: 'Go to the next level - Ingest external data'
sidebar_label: 'Ingest external data'
id: data-pipeline
keywords: [getting started, quick start, next level, data, pipeline]
tags:
    - getting started
    - quick start
    - next level
    - data
    - pipeline
---

So far, we have only directed you towards manual data ingestion techniques, using gradle tasks, forms, [SendIt](/operations/commands/server-commands/#sendit-script), Genesis Console or Postman.
Here, we shall look at how you can continuously ingest data using [Data Pipelines](/server/integration/data-pipeline/introduction/).

Data pipelines enable you to ingest data from an external source. You configure:

- what source or sources you want to ingest
- how they map to your Genesis application's data model
- what to do with this mapped data.

## Section objectives
The goal of this section is to:
- define and configure a data pipeline process
- create a data pipeline script
- ingest a csv of trades data

## Configure data pipeline

We will be configuring a local filesystem based data pipeline. This will watch a directory for changes over time and consume files that fit the criteria we configure. In this example, files will be read (line-by-line), be transformed/mapped to our data model and then stored in the Genesis database.

:::note

Ingress of files via local file system data pipelines, although a simple way to introduce yourself to data pipelines, is considered bad practice in production. Check the data pipelines docs for more information about file ingestion alternatives such as AWS S3 and FTP and relational database sources.

:::

In order to add a CSV local filesystem data pipeline, firstly, add the dependency `genesis-pal-datapipeline` to your **position-app-tutorial-script-config** module. This ensures that you are able to use the data pipeline functionality within your scripts. Ensure that Gradle imports the new dependency.

```kotlin
api("global.genesis:genesis-pal-datapipeline")
```

Now we can create a new file **positions-app-tutorial-data-pipeline.kts** with the following csv source configuration:

```kotlin
import global.genesis.gen.config.tables.TRADE
import global.genesis.gen.config.tables.TRADE.COUNTERPARTY_ID
import global.genesis.gen.config.tables.TRADE.ENTERED_BY
import global.genesis.gen.config.tables.TRADE.INSTRUMENT_ID
import global.genesis.gen.config.tables.TRADE.PRICE
import global.genesis.gen.config.tables.TRADE.QUANTITY
import global.genesis.gen.config.tables.TRADE.SIDE
import global.genesis.gen.config.tables.TRADE.TRADE_DATETIME
import global.genesis.gen.config.tables.TRADE.TRADE_STATUS

pipelines {
  csvSource("some-name") {
    location = "file:/home/positions/run/runtime/fileIngress?fileName=trades.csv"

    map("mapper-name", TRADE) {
      INSTRUMENT_ID {
        property = "instrumentId"
      }
      COUNTERPARTY_ID {
        property = "counterpartyId"
      }
      QUANTITY {
        property = "amount"
      }
      SIDE {
        property = "buySell"
      }
      PRICE {
        property = "price"
      }
      TRADE_DATETIME {
        transform {
          input.get(dateValue("date"))
        }
      }
      ENTERED_BY {
        property = "enteredBy"
      }
      TRADE_STATUS {
        transform {
          TradeStatus.NEW
        }
      }
    }
  }
}
```

In the above script, we define a CSV file source. We configure the location as a local filesystem source with an absolute path to the user account's `positions` **run/runtime/fileIngress** directory. This directory should be created automatically the first time your application is started.

The remaining configuration defines a mapper from our CSV to the data model of the `TRADE` table.

We follow the data pipeline definition with the usual runtime configuration. Ensure that you add the following config to your **-processes.xml** and **-service-definitions.xml** files:

```xml
<process name="POSITIONS_APP_TUTORIAL_DATAPIPELINE">
    <groupId>POSITIONS_APP_TUTORIAL</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
    <module>genesis-pal-datapipeline</module>
    <package>global.genesis.datapipeline.pal</package>
    <script>positions-app-tutorial-data-pipeline.kts</script>
    <description>External data ingress pipeline</description>
    <language>pal</language>
    <loggingLevel>TRACE,DATADUMP_ON</loggingLevel>
</process>
```

```xml
<service host="localhost" name="POSITIONS_APP_TUTORIAL_DATAPIPELINE" port="11006"/>
```

We are now ready to deploy the changes. Run `assemble` and then `deploy-genesisproduct-positions-app-tutorial`.

## Verify your pipeline is working

We have now configured a CSV source that listens for changes on the local file system!

You can use the following CSV as an example to test your pipeline. Create a file named `trades.csv` and paste the contents below into a running instance of your Genesis application. This will trigger the pipeline into action. 

Each row of the CSV will be parsed, mapped and stored in the database. Your CSV file will disappear when the pipeline has processed the file. You can then use the `DbMon` utility to check your database for changes.

```csv
instrumentId,counterpartyId,amount,buySell,price,date,enteredBy
APPL,A102,140,B,280,2022-09-06 16:20:20,TraderA
IBM.B,A421,11,S,120,2022-09-06 12:10:52,TraderB
MSFT,A102,140,B,280,2022-09-08 16:34:00,TraderB
APPL,Z233,100,S,400,2022-09-12 16:20:20,TraderA
```

## Conclusion
In this section, we have created a working data pipeline. Given everything is working as expected, `DbMon` will show the following 4 entries in your database.

![DbMon screenshot](/img/dbmon-datapipeline.PNG)
