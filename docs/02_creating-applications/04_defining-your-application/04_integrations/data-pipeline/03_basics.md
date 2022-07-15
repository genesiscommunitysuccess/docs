---
sidebar_position: 3
title: Basics
sidebar_label: Basics
id: datapipeline-basics

---

[Introduction](/creating-applications/defining-your-application/integrations/data-pipeline/overview/)  | [Where to define](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-where-to-define/) | [Basics](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-basics/) | [Advanced](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/) | [More examples](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/) | [Configuring runtime](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-runtime/) | [Testing](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-testing/)

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

#### PostgreSQL

| Parameter | Default value | Sample usage | Value type | Description |
|---|---|---|---|---|
| name | N/A | `postgres("cdc-test")` | String | Name for the source |
| hostname | N/A | `hostname = "localhost"` | String | Set the hostname where PostgreSQL is running |
| port | 5432 | `port = 1234` | Integer | Set the port on which PostgreSQL is running |
| username | N/A | `username = "db-user"` | String | Set the database user  |
| password | N/A | `password = "db-password"` | String | Set the database user password  |
| databaseName | N/A | `databaseName = "postgres"` | String | Set the name of the database  |

### File

Genesis currently supports CSV, JSON and XML file sources. Below, you can see what options are available for each:

#### CSV

| Parameter | Default value | Sample usage | Value type | Description |
|---|---|---|---|---|
| name | N/A | `csv("cdc-test")` | String | Name for the source |
| location | N/A | `location = "file://data/june/trades.csv"` | String | Set the location of the CSV file. See details below |
| delimiter | , | `delimiter = ';'` | Char | Set the value delimiter  |
| hasHeader | true | `hasHeader = false` | Boolean | Set whether the file has headers  |
| headerOverrides | null | `headerOverrides = arrayListOf("id", "name")` | List | Set the column names to be used. If the file has header it's ignored and the speicifed names are used  |
| readLazily | false | `readLazily = true` | Boolean | Set lazy reading  |

```kotlin
sources {
  csv("cdc-csv") {
    location = ""

    mapper("mapper-name", TABLE) {

    }
  }
}
```

#### XML and JSON

| Parameter | Default value | Sample usage | Value type | Description |
|---|---|---|---|---|
| name | N/A | `xml("cdc-test")` | String | Name for the source |
| location | N/A | `location = "file://data/june/trades.csv"` | String | Set the location of the CSV file. See details below |
| rootAt | "$.[*]" | `rootAt = "$.[*]"` | String | Set the root of the Json/XML tree |

```kotlin
sources {
  xml("cdc-xml") {
    location = ""

    mapper("mapper-name", TABLE) {

    }
  }

  json("cdc-json") {
    location = ""

    mapper("mapper-name", TABLE) {

    }
  }
}
```

#### Defining file location

File location denotes where to watch for files. This can be one of the following:
- Local file system
- S3

##### Local file system

Listening for files in a directory on the local filesystem is as simple as pointing at the directory in the `location` argument prepended by "file://".

You can also pass arguments to the URI to change the behaviour of the source.

`file:directoryName[?options]`

| Argument | Default value | Description |
|---|---|---|
| delete | true | Should delete the file after processing |
| fileName | | Only listen for files with the exact name |
| recursive | false | Should check sub directories |

##### S3

To use S3 as a file source, you will need access to an S3 like service such as AWS S3 or Dell ECS.

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

##### SFTP

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

The data from the defined source is read row by row and mapped to a [Table](/creating-applications/defining-your-application/data-model/tables/tables) object. Each column from the incoming row is mapped to a [Field](/creating-applications/defining-your-application/data-model/fields/fields).

### Mapping by column name
If the column name of the source row is the same as the [Field](/creating-applications/defining-your-application/data-model/fields/fields) name, then there is no need for explicit mapping.

If the column name of the source row is not the same as the [Field](/creating-applications/defining-your-application/data-model/fields/fields) name, then it can be specified using the `sourceProperty` parameter:

```kotlin
TRADE_SIDE {
  sourceProperty = "side"
}
```

If the type of the source row is different from the [Field](/creating-applications/defining-your-application/data-model/fields/fields) type, then it will converted in best effort.

### Mapping function
There are cases when the [Field](/creating-applications/defining-your-application/data-model/fields/fields) value is not directly mapped to the source row value. For example:

- Type conversion is complex 
- Data enrichment
- Data obfuscation
- Calcuated value based on input

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

### Declaring mappers for PostgreSQL source
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

### Mapper for a CSV file source
For a CSV file source, a single mapper can be declared using the following syntax:

```kotlin
mapper("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}
```
