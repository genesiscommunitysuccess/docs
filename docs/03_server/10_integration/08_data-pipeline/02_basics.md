---
title: 'Data Pipeline - Basics'
sidebar_label: 'Basics'
id: basics
keywords: [server, integration, data pipeline, basics]
tags:
  - server
  - integration
  - data pipeline
  - basics
---

[Introduction](/server/integration/data-pipeline/introduction/)  | [Basics](/server/integration/data-pipeline/basics) | [Advanced](/server/integration/data-pipeline/advanced) | [Examples](/server/integration/data-pipeline/examples) | [Configuring runtime](/server/integration/data-pipeline/configuring-runtime) | [Testing](/server/integration/data-pipeline/testing)

## Where to define

You can configure data pipeline in a file called _pipeline-name_**-data-pipeline.kts**. This must be located in your application's configuration directory.

The configuration contains a collection of `sources` and each one has two main sections:
- configuration: how to connect to the data source
- mapper: maps the incoming data

## How to define

A data pipeline is a collection of `sources`. Each source contains:
- the configuration specifying how to access the data
- a mapper for that data.

Currently the supported sources are:
- PostgreSQL
- MS SQL Sever
- Oracle Enterprise
- Files that originate from the local filesystem or S3
    - CSV
    - XML
    - JSON

## Data source

### Database

All databases share common configuration. 

| Parameter | Default value | Sample usage | Value type | Description |
|---|---|---|---|---|
| sourceName | N/A | `postgres("cdc-test")` | String | Name for the source |
| hostname | N/A | `hostname = "localhost"` | String | Set the hostname of the remote Database |
| port | 5432 | `port = 5432` | Integer | Set the port on which Database is running |
| username | N/A | `username = "postgres"` | String | Set the database user  |
| password | N/A | `password = "db-password"` | String | Set the database user password  |
| databaseName | N/A | `databaseName = "postgres"` | String | Set the name of the database  | 

```kotlin
sources {
  postgres("cdc-test-psql") {
    hostname = "localhost"
    port = 5432
    username = "postgres"
    password = "db-password"
    databaseName = "postgres"
  }

  msSql("cdc-test-mssql") {
    ...
  }

  oracle("cdc-test-oracle") {
    ...
  }
}
```

:::note

Remote databases will not work by default and will require some setup/configuration to enable Change Data Capture. Find details on setup [here](/operations/pipeline-setup/)

:::

### File

Genesis currently supports CSV, JSON and XML file sources. Below, you can see what options are available for each:

#### CSV

| Parameter | Default value | Sample usage | Value type | Description |
|---|---|---|---|---|
| name | N/A | `csv("csv-cdc-test")` | String | Name for the source |
| location | N/A | `location = "file://runtime/testFiles?fileName=IMPORT_TRADES.csv"`| String | Set the location of the CSV file. See details below |
| delimiter | , | `delimiter = ','` | Char | Set the value delimiter  |
| hasHeader | true | `hasHeader = true` | Boolean | Set whether the file has headers  |
| headerOverrides | null | `headerOverrides = arrayListOf("id", "name")` | List | Set the column names to be used. If the file has header it's ignored and the speicifed names are used  |
| readLazily | false | `readLazily = true` | Boolean | Set lazy reading  |

```kotlin
sources {
  csv("csv-cdc-test") {
    location = ""

    mapper("mapper-name", TABLE) {

    }
  }
}
```

#### XML and JSON

| Parameter | Default value | Sample usage | Value type | Description |
|---|---|---|---|---|
| name | N/A | `xml("xml-cdc-test")` | String | Name for the source |
| location | N/A | `location = "file://runtime/testFiles?fileName=trades_array.json"` | String | Set the location of the XML or Json file. See details below |
| Tag Name | N/A | `tagName = "Trade"` | String | Set the root tag of the XML (does not apply to Json) |
| rootAt | "$.[*]" | `rootAt = "$.[*]"` | String | Set the root of the Json/XML tree |

```kotlin
sources {
  xml("xml-cdc-test") {
    location = ""

    mapper("mapper-name", TABLE) {

    }
  }

  json("json-cdc-test") {
    location = ""

    mapper("mapper-name", TABLE) {

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

You can also pass arguments to the URI to change the behaviour of the source.

`file:directoryName[?options]`

| Argument | Default value | Description |
|---|---|---|
| delete | true | Should delete the file after processing |
| fileName | | Only listen for files with the exact name |
| recursive | false | Should check sub directories |

### S3

To use S3 as a file source, you need access to an S3 like service such as AWS S3 or Dell ECS.

`aws2-s3://bucketNameOrArn[?options]`

| Argument | Default value | Description |
|---|---|---|
| region | | The region in which S3 client needs to work |
| deleteAfterRead | true | Delete objects from S3 after they have been retrieved |
| destinationBucket | | Define the destination bucket where an object must be moved when moveAfterRead is set to true |
| moveAfterRead | false | Move objects from S3 bucket to a different bucket after they have been retrieved |
| fileName | | To get the object from the bucket with the given file name |
| accessKey | | Amazon AWS Access Key |
| secretKey | | Amazon AWS Secret Key |

### SFTP

`sftp:host:port/directoryName[?options]`

| Argument | Default value | Description |
|---|---|---|
| username | | Username to use for login |
| password | | Password to use for login |
| knownHostsUri | | Sets the known_hosts file (loaded from classpath by default), so that the SFTP endpoint can do host key verification |
| privateKeyUri | | Set the private key file (loaded from classpath by default) so that the SFTP endpoint can do private key verification |
| delete | true | Should delete the file after processing |
| fileName | | Only listen for files with the exact name |
| recursive | false | Should check sub directories |

## Mapper for the incoming data

The data from the defined source is read row by row and mapped to a [Table](/database/fields-tables-views/tables/) object. Each column from the incoming row is mapped to a [Field](/database/fields-tables-views/fields/).

### Mapping by column name
If the column name of the source row is the same as the field name, then there is no need for explicit mapping.

If the column name of the source row is not the same as the field name, then it can be specified using the `sourceProperty` parameter:

```kotlin
TRADE_SIDE {
  sourceProperty = "side"
}
```

If the type of the source row is different from the field type, then it will be converted using best effort.

### Mapping function
There are cases when the field value is not directly mapped to the source row value. For example:

- Type conversion is complex
- Data enrichment
- Data obfuscation
- Calculated value based on input

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

The data from the current source row is strongly typed and null safe. In order to be able to read it, an accessor must be defined. Since the source data is external, you must declare an accessor that can read it in a specific type. Genesis provides the following accessor functions:

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
  "public.source_trades" to mapper("incoming_trades", TRADE) {
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
"table-name" to mapper("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}
```

Multiple tables can be mapped and all mappers are part of the `table` configuration:

```kotlin
table {
  "public.source_trades" to mapper("incoming_trades", TRADE) {}
  "public.source_audit" to mapper("incoming_audits", AUDIT) {}
}
```

### Mapper for a file source

For a file source, a single mapper can be declared using the following syntax:

```kotlin
mapper("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}
```
