---
title: 'Resources'
id: resources
---

# Resources

With Fuse, you can define a resources script to read in external data to your application.

This can be used to populate your tables with seed data or to keep your application in sync with an external database.

Supported external data sources include:

- Local files (CSV, JSON, XML)
- PostgreSQL databases

## Defining a Resource

To begin, create a new Kotlin Script (.kts) file `resources.kts` in the `src/main/resources/scripts` directory of your application.

:::caution
You can define as many resources as you want, but **the application must only contain a single resources script.**
:::

When defining a resource, you must specify a name and a Resource Type.  

The Resource Type dictates the type of external data you wish to read into your application, it can be defined using one of the following:

- `ResourceType.CSV`
- `ResourceType.JSON`
- `ResourceType.XML`
- `ResourceType.PostgreSQL`

Once you have defined your resource, you can then add the necessary configuration for your chosen resource type.

:::note
Local files will be copied when the application is deployed and consumed on startup.
Databases, however, will continue to update as transactions occur, acting as a continuous pipeline of data.
:::


### File Resources
  
```kotlin
resources {
    resource("example-csv", ResourceType.CSV) {
        fileName = "input-data.csv"

        table(to = TRADE)
    }
}
```

To configure a file resource you need only provide the name of the file you wish to read from, and the table you wish to read into.

The `to` parameter of the table definition must refer to an existing table object from your application. As a file can only contain a single table, only a single table definition is valid for a file resource.

The above example shows the the minumum configuration, this simple definition assumes all fields in the source data map directly to the fields in the given table.

To map differently named fields or columns, see the [Mapping Fields](#mapping-fields) section.

:::caution
All files you wish to read from must be placed in the `src/main/resources/data` directory of your application.
:::

### Database resources

```kotlin
resources {
    resource("example-postgres", ResourceType.PostgreSQL) {
        hostname = "host.docker.internal"
        port = 5433
        username = "postgres"
        password = "docker"
        databaseName = "my-postgres"

        tables {
            table(to = TRADE, from = "public.trade-test")
            table(to = INSTRUMENTS, from = "public.external-instruments")
        }
    }
}
```

To configure a database resource you must provide the following:

- hostname
- port
- username
- password
- databaseName (optional)

Other than databaseName, all properties are required in order to successfully connect to the external database.

If no databaseName is provided it will be set to the default database name of the DBMS ("postgres" for PostgreSQL).

As a database can contain multiple tables, a definition is required for each table you wish to read data from.
In the example above you can see two table mappings, each provides a `to` and `from` parameter.

As with file resources, the `to` parameter must refer to an existing table object in your application.
The `from` parameter must refer to a table in your external database.

:::caution
Table names take the form `schema.table` so table `test` in the `public` schema should have the name `public.test`.
:::

### Mapping fields

If your field names differ from the columns of the external data source, you must map the field names accordingly.

Below is an example mapping the tradeId field:

```kotlin
table(to = TRADE, from = "trade-test") {
    tradeId mapsTo "test-trade-id"
}
```

The above example tells the application to map all data from the "test-trade-id" column in the external database to the tradeId column in our applications TRADE table.

Within a table block, IntelliJ will provide intellisense suggestions for all fields on the given table.
The left hand side of the `mapsTo` function must always refer to a field in your application's table.

### Formatting dates

In order to ensure date time fields can be read correctly you must specify date formats for each field.

If no format is provided for a field it will default to [ISO8601](https://www.iso.org/iso-8601-date-and-time-format.html), alternative formats can be given with the `formatWith` function like so:

```kotlin
table(to = TRADE, from = "trade-test") {
    modifyTime formatWith ISO8601_MILLIS
}
```

- `formatWith` is only valid for Date or DateTime fields
- `formatWith` accepts any string as a format, if you override the default format with an incorrect pattern your data will fail to read.
- In order to ensure your pattern is valid, please refer to the [Joda Time Docs](https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html) for constructing format patterns.
- A set of standard date time constants are available for you to use, which should cover a majority of date time formats, these can be found in the below table:

| Name          | Description                                                                    | Format                 | Example                   |
|:--------------|--------------------------------------------------------------------------------|------------------------|---------------------------|
| **ISO8601**   | ISO Standard Date Time with Time Zone (No Milliseconds)                        | yyyy-MM-dd'T'HH:mm:ssZ | 2022-10-21T10:01:22 +0000 |
| **ISO8601-MILLIS** | ISO Standard Date Time with Time Zone (Millisecond precision)             | yyyy-MM-dd'T'HH:mm:ss.SSSZ | 2022-10-21T10:01:22.365 +0000 |
| **POSTGRES_DATETIME** | Standard Date Time format for PostgreSQL databases, and other DBMS'.   | yyyy-MM-dd HH:mm:ss        | 2022-10-21 10:01:22   |
| **POSTGRES_DATE** | Standard Date Time format for PostgreSQL databases, and other DBMS'.       | yyyy-MM-dd                 | 2022-10-21            |
| **SIMPLE_UK** | Simple date time in UK format, human readable, no time zone.                   | dd/MM/yyyy HH:mm:ss        | 21/10/2022 10:01:22   |
| **SIMPLE_US** | Simple date time in US format, human readable, no time zone.                   | MM/dd/yyyy HH:mm:ss        | 10/21/2022 10:01:22   |

:::note
The `formatWith` and `mapsTo` functions can be chained together in any order, you can see this in the full example below.
:::

## Full example

Below is a resources script showcasing all the available features across a couple of different configurations:

```kotlin
resources {
    resource("test-postgres", ResourceType.PostgreSQL) {
        hostname = "localhost"
        port = 5402
        username = "myusername"
        password = "verysecure"

        tables {
            table(to = TRADE, from = "public.trade") {
                tradeId mapsTo "test-trade-id"
            }
            table(to = INSTRUMENT, from = "public.inst")
        }
    }

    resource("test-csv", ResourceType.CSV) {
        fileName = "input-data.csv"

        table(to = TRADE) {
            tradeDateTime formatWith POSTGRES_DATETIME mapsTo "trade_date_time"
            modifyTime mapsTo "modify_time" formatWith ISO8601_MILLIS
        }
    }
}
```

## Preparing your data

### Files

In order for a file to be read from the data must have the correct format, snippets of example data for each file type can be found below:

<details> 
  <summary>CSV</summary>

  ```
  Id,InstrumentRic,InstrumentName,Price,Quant,BuySell,TradeTime,Trader,Status
  OTS0004,ABC,Inst1,127.0,500,BUY,05/24/2022 10:01:00,Trader,NEW
  ```
</details>

<details> 
  <summary>JSON</summary>

  ```
[
    {
        "TradeId": "BBGTRADE0100",
        "InstIds": {
        "InstDesc": "Barclays",
        "InstId": [
            "BARC",
            123456781
        ]
        },
        "Price": 100,
        "Quant": 2000,
        "Dir": "S",
        "TradedAt": "20220523-18:01:01",
        "Status": "NEW",
        "LinkedTradeId": ""
    },
    ...
]
  ```
</details>

<details> 
  <summary>XML</summary>

  ```
  <?xml version="1.0" encoding="UTF-8"?>
  <TradeFeed xmlns="urn:tradefeed-xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <Trade>
        <TradeId>BBGTRADE0100</TradeId>
        <InstIds>
        <InstDesc>Barclays</InstDesc>
        <InstId type="RIC">BARC</InstId>
        <InstId type="SEDOL">0123456789</InstId>
        </InstIds>
        <Price>157</Price>
        <Quant>2000</Quant>
        <Dir>S</Dir>
        <TradedAt>20220523-16:01:01</TradedAt>
        <Status isUnsol="N">NEW</Status>
        <LinkedTradeId></LinkedTradeId>
        <TradeNotes>New trade, existing instrument</TradeNotes>
    </Trade>
    ...
   </TradeFeed>
  ```
</details>

### Databases

In order to read from an external database you must ensure the column types match up with the fields in your application's table.

Some examples of where this can break your script:

- Storing a date in a `VARCHAR` column and attempting to read to a `DateTime` field.
- Attempting to read an `INT` column into a field of type `Double`.
- Providing a [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time) to a `DateTime` field.

:::caution
If reading from an external PostgreSQL database, you must ensure the `wal_level` configuration is set to at least `logical`.

See the [PostgreSQL](https://www.postgresql.org/docs/current/wal-configuration.html) or [Debezium](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-server-configuration) docs for more information.
:::

## Deploying your script

Once you have written your `resources.kts` script you now need to deploy it.

No special actions need to be taken to make the script work, simply assemble the application and deploy using either WSL or Docker.

If there are any syntax errors in your script, they will show up when attempting to assemble.

## Debugging your resources script

After deploying, you can check your application's status by using the `mon` command, your resources script will run once the `APPNAME_DATAPIPELINE` process has started up.

If all has worked as intended, after your application starts up you should now see the external data appear in your tables and thus any grids that read from those tables.

If you dont have any grids set up and want to check the contents of the database after importing, you can use the `DbMon` command to view the tables and their data.

If the process has failed to start, or has started but you don't see any data in the table, you can check the logs to determine the cause of the issue:

- Logs are stored in the `run/appname/runtime/logs` directory, you can use `cd $L` to get to it.
- The `APPNAME_DATAPIPELINE.log` will contain any stacktraces or errors caused when attempting to read the script.

### Notes on using Docker

- When using Docker you will have to run the `docker exec -it {containerId} /bin/bash` command to access `DbMon` and view any logs.
- If your external DB is also being ran in Docker, ensure the hostname you provide in the resource script is accessible from within your applications container.
  - In the examples above you can see the hostname `host.docker.internal` is used, this allows the application container to connect to the external databases container via Dockers internal network. See [here](https://docs.docker.com/desktop/networking/) for more information.
