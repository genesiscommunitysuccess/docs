---
title: 'Data Pipeline - basics'
sidebar_label: 'Basics'
id: basics
keywords: [server, integration, data pipeline, basics]
tags:
  - server
  - integration
  - data pipeline
  - basics
---

## Where to define

You can configure Data Pipelines in a file called _pipeline-name_**-data-pipeline.kts**. This must be located in your application's configuration directory.

A pipeline configuration contains a collection of `sources`, one or many `map` functions and one or many `sink` functions.

## Script properties

The following properties are available for use within the script:

```kotlin
val systemDefinition: SystemDefinitionService
val serviceDiscovery: ServiceDiscovery
```

## How to define a source

Each Data Pipeline source contains the configuration specifying how to access the data and the associated mapping and sink functionality.

:::note
Remote databases do not work with Data Pipelines by default; they require some set-up/configuration to enable Change Data Capture functionality. More details can be found in the pages on [Pipeline set-up](../../../../operations/pipeline-setup/).
:::

The currently supported sources are:

**Ingress:**
- PostgreSQL
- MS SQL Server
- Oracle Enterprise
- Files
  - CSV
  - XML
  - JSON

**Egress:**
- Genesis application database

### External database

All databases share a common configuration. 

| Parameter     | Default value | Sample usage                            | Value type    | Description                               |
|---------------|---------------|-----------------------------------------|---------------|-------------------------------------------|
| sourceName    | N/A           | `postgres("cdc-test")`                  | String        | name for the source                       |
| hostname      | N/A           | `hostname = "localhost"`                | String        | set the hostname of the remote Database   |
| port          | 5432          | `port = 5432`                           | Integer       | set the port on which Database is running |
| username      | N/A           | `username = "postgres"`                 | String        | set the database user                     |
| password      | N/A           | `password = "db-password"`              | String        | set the database user password            |
| databaseName  | N/A           | `databaseName = "postgres"`             | String        | set the name of the database              | 
| errorStrategy | BestEffort    | `errorStrategy = StopOnFirstFailure()"` | ErrorStrategy | Set the source's error strategy           | 

```kotlin
pipelines {
  postgresSource("cdc-test-psql") {
    hostname = "localhost"
    port = 5432
    username = "postgres"
    password = "db-password"
    databaseName = "postgres"
  }

  msSqlSource("cdc-test-mssql") {
    ...
  }

  oracleSource("cdc-test-oracle") {
    ...
  }
}
```





### File

Genesis currently supports CSV, JSON and XML file sources.

In addition to the configuration properties explained below, each file type also has an optional `onCompletion` block, which can be used to specify what to do after the file has been processed.
The following are in scope:
* `entityDb`: a read/write handle on the database
* `result`: contains information about the lines that were processed successfully and the lines that failed
* `context`: contains pipeline contextual information such as `fileName` and `movePath` (if a move path was specified in the `location`)

Below, you can see what options are available for each:

#### CSV

| Parameter | Default value | Sample usage | Value type | Description |
|---|---|---|---|---|
| name | N/A | `csvSource("csv-cdc-test")` | String | name for the source |
| location | N/A | `location = "file://runtime/testFiles?fileName=IMPORT_TRADES.csv"`| String | set the location of the CSV file. See details below |
| delimiter | , | `delimiter = ','` | Char | set the value delimiter  |
| hasHeader | true | `hasHeader = true` | Boolean | set whether the file has headers  |
| headerOverrides | null | `headerOverrides = arrayListOf("id", "name")` | List | set the column names to be used. If the file has a header, it is ignored and the specified names are used  |
| readLazily | false | `readLazily = true` | Boolean | Set lazy reading  |
| errorStrategy | BestEffort    | `errorStrategy = StopOnFirstFailure()"` | ErrorStrategy | set the source's error strategy           | 

```kotlin
pipelines {
  csvSource("csv-cdc-test") {
    location = ""

    map("mapper-name", TABLE) {

    }
    
    onCompletion {
        val successfulRows = result.successfulRows
        val failedRows = result.failedRows
        val existingRecords = entityDb.getBulk(TABLE).toList()
        val fileName = context.fileName
        // ...
    }
  }
}
```

#### XML and JSON

| Parameter | Default value | Sample usage | Value type | Description |
|-----------|---|---|---|---|
| name      | N/A | `xmlSource("xml-cdc-test")` | String | Name for the source |
| location  | N/A | `location = "file://runtime/testFiles?fileName=trades_array.json"` | String | set the location of the XML or Json file. See details below |
| tagName   | N/A | `tagName = "Trade"` | String | set the root tag of the XML (does not apply to Json) |
| rootAt    | "$.[*]" | `rootAt = "$.[*]"` | String | set the root of the Json/XML tree |
| errorStrategy | BestEffort    | `errorStrategy = StopOnFirstFailure()"` | ErrorStrategy | set the source's error strategy           | 

```kotlin
pipelines {
  xmlSource("xml-cdc-test") {
    location = ""

    map("mapper-name", TABLE) {

    }

    onCompletion {
      // ...
    }
  }

  json("json-cdc-test") {
    location = ""

    map("mapper-name", TABLE) {

    }
  }
}
```

### Defining file location

File location denotes where to watch for files. This can be one of the following:
- Local file system
- SFTP
- S3

### Local file system

Listening for files in a directory on the local filesystem is as simple as pointing at the directory in the `location` argument prepended by "file://".

You can define a path as absolute or relative, but we recommend that you specify the absolute filepath; this ensures that you get the right files in the right place. 

If you use a relative file path and there is a mistake in the file path, no error message is generated. A new folder is created if the one specified does not exist, for example. The Data Pipeline is based on Apache Camel and you can find further details of this in the [Camel documentation](https://camel.apache.org/components/3.18.x/languages/file-language.html).

You can also pass arguments to the URI to change the behaviour of the source.

`file:directoryName[?options]`

| Argument | Default value | Description |
|---|---|---|
| delete | true | Should delete the file after processing |
| fileName | | Only listen for files with the exact name |
| recursive | false | Should check sub directories |

### S3

To use S3 as a file source, you need access to an S3-like service such as AWS S3 or Dell ECS.

`aws2-s3://bucketNameOrArn[?options]`

| Argument | Default value | Description |
|---|---|---|
| region | | the region in which S3 client needs to work |
| deleteAfterRead | true | delete objects from S3 after they have been retrieved |
| destinationBucket | | the destination bucket where an object must be moved when moveAfterRead is set to true |
| moveAfterRead | false | move objects from S3 bucket to a different bucket after they have been retrieved |
| fileName | | file name of the bucket to get the object from |
| accessKey | | Amazon AWS Access Key |
| secretKey | | Amazon AWS Secret Key |

### SFTP

`sftp:host:port/directoryName[?options]`

| Argument | Default value | Description |
|---|---|---|
| username | | username to use for login |
| password | | password to use for login |
| knownHostsUri | | set the known_hosts file (loaded from classpath by default), so that the SFTP endpoint can do host key verification |
| privateKeyUri | | set the private key file (loaded from classpath by default) so that the SFTP endpoint can do private key verification |
| delete | true | delete the file after processing |
| fileName | | only listen for files with the exact name |
| recursive | false | check sub directories |

### Genesis Table

The Genesis Table source attaches a listener to a chosen table in your application. 

All inserts, modifications and deletions to the table will be processed. Records from before pipeline start-up will not be replayed.

| Parameter | Sample usage | Value type | Description |
|---|---|---|---|
| table | `genesisTableSource(TRADE)` | GPalTable | table to be listened to |
| key | `key = TRADE.BY_ID` | GPalIndex | used for table lookups |

```kotlin
pipelines {
  genesisTableSource(TABLE) {
    key = TABLE.KEY_FIELD

    map("mapper-name", TABLE) {

    }
  }
}
```

## Error strategies

You can choose how to handle errors that occur during processing on a per-source basis by setting the `errorStrategy` property on a source. The default error strategy is Best Effort.

When an error occurs, by default, the error strategy will set the state of the process to `ERROR`. This can be changed by setting the `setProcessOnError` property for the strategy.

```kotlin
errorStrategy = BestEffort(setProcessOnError = false)
```

The error strategies available are described below.

### Best Effort

The Best Effort strategy processes all rows and logs any errors that occur.

```kotlin
errorStrategy = BestEffort()
```

### Stop On First Failure

The Stop On First Failure strategy logs an error if it occurs and stops processing.

```kotlin
errorStrategy = StopOnFirstFailure()
```

### All Or Nothing

The All Or Nothing strategy processes all rows in a single transaction using the Genesis Entity DB API. If one row fails, then none of the rows are committed.

This is only relevant to [databases that support Entity DB transactions](../../../02_database/05_database-interface/01_entitydb.md/#transactions).

```kotlin
errorStrategy = AllOrNothing()
```

## Map functions

A map function is a step between the reading of a source event and the resulting sinking of this event. Data is read, one record at a time and is mapped to or from a Genesis Table Entity.

- For ingress, all data is mapped to a Table Entity before being sent to the sink operation.
- For egress, data is read from the database and mapped to an intermediary state that is used by the sink operation.

### Mapping by column name
If the column name of the source row is the same as the field name, then there is no need for explicit mapping.

If the column name of the source row is not the same as the field name, then it can be specified using the `property` parameter:

```kotlin
TRADE_SIDE {
  property = "side"
}
```

If the type of the source row is different from the field type, then it is converted using Best Effort.

### Transform function

There are cases when the source value is not directly mapped to the destination value. For example:

- type conversion is complex
- data enrichment
- data obfuscation
- calculated value based on input

For such cases, each mapper can declare a `transform` function. Here are a few examples:

```kotlin
TRADE_DATE {
  transform {
    DateTime(input.get(tradedAt))
  }
}

INSTRUMENT_ID {
  transform {
    "${input.get(instrument)}-RIC"
  }
}

CURRENCY_ID {
  transform {
    "GBP"
  }
}
```

The `transform` function has two parameters:

- `entityDb` - object to access the underlying Genesis database
- `input` - object to access the current source row

For egress pipelines, the input takes the type of the database table entity you are mapping from.

For ingress, the input is strongly typed and null safe. In order to be able to read it, an accessor must be defined. Since the source data is external, you must declare an accessor that can read it in a specific type. Genesis provides the following accessor functions:

- `stringValue(name: String)`
- `nullableStringValue(name: String)`
- `intValue(name: String)`
- `nullableIntValue(name: String)`
- `longValue(name: String)`
- `nullableLongValue(name: String)`
- `doubleValue(name: String)`
- `nullableDoubleValue(name: String)`
- `booleanValue(name: String)`
- `nullableBooleanValue(name: String)`

Here is some sample usage:

```kotlin
table {
  "public.source_trades" to map("incoming_trades", TRADE) {
    val tradeId = stringValue("trd_id")
    TRADE {
      TRADE_ID {
        transform {
          "${input.get(tradeId)}-TradeStore"
        }
      }
    }
  }
}
```

### Declaring mappers for database sources

For PostgreSQL sources, mappers must be declared per table using the following syntax:

```kotlin
"table-name" to map("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}
```

Multiple tables can be mapped and all mappers are part of the `table` configuration:

```kotlin
table {
  "public.source_trades" to map("incoming_trades", TRADE) {}
  "public.source_audit" to map("incoming_audits", AUDIT) {}
}
```

### Mapper for a file source and Genesis tables

For a file source, a single mapper can be declared using the following syntax:

```kotlin
map("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}
```

### Conditional map functions

There may be a time when you wish to map based on some business logic. Within your `map` function, you can define a `where` block that is evaluated before any mapping operations are started.

```kotlin
map("mapper-name", TABLE_OBJECT) {
    where { input.get(stringValue("BuySell")) == "s" }

    TABLE_OBJECT {
        FIELD {}
        ...
    }
}
```

You are provided with the following variables within a `where` block:

| Parameter | Description |
|---|---|
| entityDb | object to access the underlying Genesis database |
| input | the data object of the Data Pipeline trigger event |
| operation | the operation of the Data Pipeline trigger event |

For ingress, the `input` is strongly typed and null safe. Like `transform` functions an accessor is required. For egress, the `input` takes the type of the database table entity you are mapping from.

### Declaring reusable map functions

You can declare map and sink functions outside the pipeline block and reuse these in your pipeline definition. These map functions look mostly the same but use a slightly different function name:

```kotlin
val inboundMapper = buildInboundMap("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}

val outboundMapper = buildOutboundMap("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}

pipelines {
  xmlSource("xml-cdc-test") {
    location = ""

    map(inboundMapper).sink {
      ...
    }
  }

  genesisTableSource(TABLE_OBJECT) {
    key = TABLE_OBJECT.KEY_FIELD

    map(outboundMapper).sink(preDefinedSink)
  }
}
```

## Sink functions

A `sink` function is where you define the logic to do something with the data that has been picked up by your Data Pipelines and successfully mapped. This usually involves storing the data in another data store (database, log, etc.) either directly or after applying some additional logic of your choosing. `transform` functions are also available for applying business logic inside your `map` functions as shown above.

### Ingress

The default behaviour of an ingress Data Pipeline is to store the mapped [Table](../../../../database/fields-tables-views/tables/) object in the Genesis database. However, there are times when you might want to delete or modify that entity, or perform other conditional operations that do not interact with the database at all. For those cases, the `sink` function can be used. The function has two parameters:

- `entityDb` - object to access the underlying Genesis database
- `mappedEntity` - the mapped Table object

Recognising that inserting, modifying or deleting mapped entities will be the most commonly used operations, those are already defined under `SinkOperations`:

- `SinkOperations.INSERT`
- `SinkOperations.MODIFY`
- `SinkOperations.DELETE`

They can be used like this:

```kotlin
pipelines {
    postgresSource("cdc-postgres") {

        ...

        map(someMap).sink(SinkOperations.DELETE)

    }
}
```

#### Conditional sink operations

You can use the `where` function within the `map` to delete or modify records conditionally, so you don't have to map all rows:

```kotlin
pipelines {
    postgresSource("cdc-postgres") {

        ...

        map(someMap).apply {
            where { input.get(stringValue("side") == "sell") }
        }.sink(SinkOperations.DELETE)
    }
}
```

In other cases when you want to act based on the state of the mapped entity, you can declare a custom sink method:

```kotlin
pipelines {
    postgresSource("cdc-postgres") {

        ...

        map(someMap).sink {
            if (mappedEntity.tradeType == "sell") {
                entityDb.delete(mappedEntity)
            } else {
                entityDb.insert(mappedEntity)
            }
        }
    }
}
```

### Egress

An egress Data Pipeline provides a sink operation for SQL-based JDBC databases. For convenience, the platform provides helper classes for Postgres, MS SQL Server and Oracle databases.

In the example below, we define a Postgres configuration object and pass this into our `sink` declaration. Our sink takes the database configuration and provides with methods to describe the behaviour for each operation that the pipeline can pick up.

```kotlin
val postgresConfig = postgresConfiguration(
    databaseName = "",
    hostname = "",
    port = 5432,
    username = "",
    password = ""
)

val postgresSink = sink(postgresConfig) {
    onInsert = insertInto("tableName")
    onModify = updateTable("tableName")
    onDelete = deleteFrom("tableName")
}

pipelines {
    genesisTableSource(TABLE_OBJECT) {
        key = TABLE_OBJECT.KEY_FIELD

        map(someMapper).sink(postgresSink)
    }
}
```

The `sink` function has three optional settings:

| Argument | Default value | Description |
|---|---|---|
| onInsert | null | operation to run on Genesis DB insert operation |
| onModify | null | operation to run on Genesis DB modify operation |
| onDelete | null | operation to run on Genesis DB delete operation |

All these operations are executed via SQL and take the order of the mapped field entities as they are found in your map configuration.

#### onInsert 

Takes either `insertInto("table name")` or `callProcedure("stored proc name")`

#### onModify

Takes `updateTable("table name")`

#### onDelete

Takes `deleteTable("table name")`

#### Conditional sink operations

Egress sinks can use the `where` function within the `map`, giving you the ability to map rows conditionally before the sink operation:

```kotlin
pipelines {
    genesisTableSource(TABLE_OBJECT) {
        key = TABLE_OBJECT.KEY_FIELD

        map(someMapper).apply {
            where { input.side == SIDE.SELL }
        }.sink(postgresSink)
    }
}
```
