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
- MSSQL
- CSV, XML and JSON files that originate from the local filesystem or over FTP and S3

## Source of data

### PostgreSQL

| Parameter | Default value | Sample Usage | Value Type | Description |
|---|---|---|---|---|
| name | N/A | `postgres("cdc-test")` | String | Name for the source |
| hostname | N/A | `hostname = "localhost"` | String | Set the hostname where PostgreSQL is running |
| port | 5432 | `port = 1234` | Integer | Set the port on which PostgreSQL is running |
| username | N/A | `username = "db-user"` | String | Set the database user  |
| password | N/A | `password = "db-password"` | String | Set the database user password  |
| databaseName | N/A | `databaseName = "default"` | String | Set the name of the database  |

### MSSQL

| Parameter | Default value | Sample Usage | Value Type | Description |
|---|---|---|---|---|
| name | N/A | `postgres("cdc-test")` | String | Name for the source |
| hostname | N/A | `hostname = "localhost"` | String | Set the hostname where PostgreSQL is running |
| port | 5432 | `port = 1234` | Integer | Set the port on which PostgreSQL is running |
| username | N/A | `username = "db-user"` | String | Set the database user  |
| password | N/A | `password = "db-password"` | String | Set the database user password  |
| databaseName | N/A | `databaseName = "default"` | String | Set the name of the database  |

### CSV file

| Parameter | Default value | Sample Usage | Value Type | Description |
|---|---|---|---|---|
| name | N/A | `csv("csv-test")` | String | Name for the source |
| location | N/A | `location = "file://data/june/?fileName=trades.csv"` | URI | Set the location of the CSV file in URI format |
| delimiter | , | `delimiter = ;` | Char | Set the value delimiter  |
| hasHeader | true | `hasHeader = false` | Boolean | Set whether the file has headers  |
| headerOverrides | null | `headerOverrides = arrayListOf("id", "name")` | List | Set the column names to be used. If the file has header it's ignored and the speicifed names are used  |
| readLazily | false | `readLazily = true` | Boolean | Set lazy reading  |

### JSON file

| Parameter | Default value | Sample Usage | Value Type | Description |
|---|---|---|---|---|
| name | N/A | `xml("xml-test")` | String | Name for the source |
| location | N/A | `location = "file://data/june/?fileName=trades.json"` | URI | Set the location of the JSON file in URI format |
| rootAt | $.[*] | `rootAt = "$.TradeFeed.Trade.[*]"` | String | Set where the objects to be mapped start from. Useful for collections that are wrapped inside other objects. See [More examples](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/) |

### XML file

| Parameter | Default value | Sample Usage | Value Type | Description |
|---|---|---|---|---|
| name | N/A | `csv("json-test")` | String | Name for the source |
| location | N/A | `location = "file://data/june/?fileName=trades.xml"` | URI | Set the location of the XML file in URI format |
| tagName | $.[*] | `tagName = "Trade"` | String | Set the tag that contains the objects to be mapped. See [More examples](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/) |


## Mapper for the incoming data

The data from the defined source is read row by row for CSV and relational database source or one object at a time for XML and JSON. Each such entity is mapped to a [Table](/creating-applications/defining-your-application/data-model/tables/tables) object. Each row has columns and each object has fields. Those will be reffered to as properties for the sake of simplicity. Each property from the incoming entity is mapped to a [Field](/creating-applications/defining-your-application/data-model/fields/fields).

### Mapping by property name
If the property name of the source entity is the same as the [Field](/creating-applications/defining-your-application/data-model/fields/fields) name, then there is no need for explicit mapping.

If the property name of the source entity is not the same as the [Field](/creating-applications/defining-your-application/data-model/fields/fields) name, then it can be specified using the `sourceProperty` parameter:

```kotlin
TRADE_SIDE {
  sourceProperty = "side"
}
```

If the type of the source row is different from the [Field](/creating-applications/defining-your-application/data-model/fields/fields) type, then it will be converted in best effort. Note that for source property of type `String` to be converted to `DateTime` type, it has to be in epoch milliseconds. E.g. source property with value of `1657211303` will be succesfully converted to valid `DateTime` [Field](/creating-applications/defining-your-application/data-model/fields/fields). If that's not the case a custom `transform` function is required as specified below.

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

### Value accessors
Accessing values for column based sources like CSV and relational databases is quite easy as each column has a name(e.g. `sourceProperty = "address"`). However, this is not the case for hierarchically structured data like JSON and XML formats. For such sources accessing values requires navigation path. The syntax used by mappers to access the values is [JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901) and it looks like this - `/<node-name>` or `/<node-index>` - e.g. `/Instruments/0/Name`.

Consider the following JSON file:
```json
{
  "TradeFeed": {
    "Trade": [
      {
        "TradeId": "100",
        "InstId": 123456781,
        "Price": 100,
        "Quant": 2000,
        "TradedAt": "20220523-18:01:01"
      },
      {
        "TradeId": "101",
        "InstId": 123456782,
        "Price": 157,
        "Quant": 2000,
        "TradedAt": "20220523-18:02:02"
      }
    ]
  }
}
```
To access the value for `TradedAt` for the second trade the JSON pointer looks like: `/TradeFeed/Trade/1/TradedAt`

### Declaring mappers for PostgreSQL and MSSQL source
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

### Mapper for file sources
For file sources, a single mapper can be declared using the following syntax:

```kotlin
mapper("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}
```
