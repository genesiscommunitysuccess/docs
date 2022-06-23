---
sidebar_position: 3
title: Basics
sidebar_label: Basics
id: datapipeline-basics

---

[Introduction](/creating-applications/defining-your-application/integrations/data-pipeline/overview/)  | [Where to define](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-where-to-define/) | [Basics](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-basics/) | [Advanced](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/) | [More examples](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/) | [Configuring runtime](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-runtime/) | [Testing](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-testing/)

A data pipeline is a collection of `sources`. Each source contains configuration how to access the data and a mapper for that data. Currently the supported sources are:
- PostgreSQL
- CSV files over FTP, S3

### Source of data

#### PostgreSQL

| Parameter | Default value | Sample Usage | Value Type | Description |
|---|---|---|---|---|
| name | N/A | `postgresSource("cdc-test")` | String | Name for the source |
| hostname | N/A | `hostname = "localhost"` | String | Set the hostname where PostgreSQL is running |
| port | 5432 | `port = 1234` | Integer | Set the port on which PostgreSQL is running |
| username | N/A | `username = "db-user"` | String | Set the database user  |
| password | N/A | `password = "db-password"` | String | Set the database user password  |
| databaseName | N/A | `databaseName = "postgres"` | String | Set the name of the database  |

#### CSV file

| Parameter | Default value | Sample Usage | Value Type | Description |
|---|---|---|---|---|
| name | N/A | `csvSource("cdc-test")` | String | Name for the source |
| location | N/A | `location = "//data/june/trades.csv"` | String | Set the location of the CSV file |
| delimiter | , | `delimiter = ;` | Char | Set the value delimiter  |
| hasHeader | true | `hasHeader = false` | Boolean | Set whether the file has headers  |
| headerOverrides | null | `headerOverrides = arrayListOf("id", "name")` | List | Set the column names to be used. If the file has header it's ignored and the speicifed names are used  |
| readLazily | false | `readLazily = true` | Boolean | Set lazy reading  |

### Mapper for the incoming data

The data from the defined source is read row by row and mapped to [Table](/creating-applications/defining-your-application/data-model/tables/tables) object. Each column from the incoming row is mapped to a [Field](/creating-applications/defining-your-application/data-model/fields/fields).

#### Mapping by column name
If the column name of the source row is the same as the [Field](/creating-applications/defining-your-application/data-model/fields/fields) name then there is no need explicit mapping. 
If the column name of the source row is not the same as the [Field](/creating-applications/defining-your-application/data-model/fields/fields) name then it can be specified by using `sourceProperty` parameter

```kotlin
TRADE_SIDE {
  sourceProperty = "side"
}
```

If the type of the source row is different from the [Field](/creating-applications/defining-your-application/data-model/fields/fields) type then it will converted in best effort.

#### Mapping function
There are cases when the [Field](/creating-applications/defining-your-application/data-model/fields/fields) value is not directly mapped to the source row value. For example:
- Type conversion is complex 
- Data enrichment
- Data obfuscation
- Calcuated value based on input

For such cases each mapper can declare a `transform` function. Few examples:

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

The data from the current source row is strongly typed and null safe and in order to be able to read it an accessor must be defined first. Since the source data is external it's developer's responsibility to declare an accessor that can read it in a specific type. Genesis provides the following accessor functions:
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

Sample usage:

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
For PostgreSQL sources mappers are declared per table using the following syntax:

```kotlin
"table-name" to mapper("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}
```

Multiple tables can be mapped and all mappers are part of `table` configuration:

```kotlin
table {
  "public.source_trades" to mapper("incoming_trades", TRADE) {}
  "public.source_audit" to mapper("incoming_audits", AUDIT) {}
}
```

### Declaring mapper for CSV file source
For CSV file source a single mapper can be declared using the following syntax:

```kotlin
mapper("mapper-name", TABLE_OBJECT) {
    TABLE_OBJECT {
        FIELD {}
        ...
    }
}
```