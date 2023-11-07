---
title: 'Data Pipeline - introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, integration, data pipeline, introduction]
tags:
  - server
  - integration
  - data pipeline
  - introduction
---

Genesis Data Pipelines enable you to stream data into and out of your Genesis application.

Each Data Pipeline defines a source, some mapping operations and a sink.

| term | description |
| ---- | ----------- |
| source | Changes in data at this location trigger your Data Pipeline |
| map | Transforms data from the data source |
| sink | Does something with the mapped data from the data source |

## Data Pipeline ingress

You can define Data Pipelines that map data from an external source (database, file) to [tables](../../../../database/fields-tables-views/tables/) in your application. By default, the resulting Table objects are stored in the application database. If you want to change this behaviour, you can define [custom sink operations](../../../../server/integration/data-pipeline/advanced/#custom-handler-for-the-mapped-entity).

Each Data Pipeline defines a source for the data and maps that data to each [field](../../../../database/fields-tables-views/fields/) in the table.

If a field mapping is not one-to-one - e.g. complex type conversions, data obfuscation, enriched values - you can define a `transform` function that returns `Any`.

Here is a sample configuration:
```kotlin
pipelines {

    postgresSource("cdc-test") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = "docker"
        databaseName = "postgres"

        table {
            "public.source_trades" to map("incoming_trades", TRADE) {
                val tradeId = stringValue("trd_id")
                val tradedAt = longValue("traded_at")

                TRADE {

                    TRADE_TYPE {
                        property = "side"
                    }

                    TRADE_DATE {
                        transform {
                            DateTime(input.get(tradedAt))
                        }
                    }

                    RECORD_ID {
                        transform {
                            input.get(tradeId).removePrefix("ITS_").toLong()
                        }
                    }
                }
            }
        }
    }
}
```

Once your Genesis application is running, data ingestion will take place.

## Data Pipeline egress

Data Pipelines can also be defined to listen to changes within your application's database and react to these changes. These changes can be mapped and then sinked into an external database.

Here is a sample configuration:
```kotlin
val postgresConfig = postgresConfiguration(
    databaseName = "test",
    hostname = "localhost",
    port = 5432,
    username = "test",
    password = "test"
)

pipelines {
    genesisTableSource(TRADE) {
        key = TRADE.BY_ID

        map("", TRADE) {
            TRADE {
                TRADE.TRADE_ID {
                    property = "id"
                }
                TRADE.INSTRUMENT_ID {
                    property = "instrument"
                }
                TRADE.PRICE {
                    property = "price"
                    transform {
                        "$ $input"
                    }
                }
                TRADE.QUANTITY {
                    property = "quantity"
                }
            }
        }.sink(postgresConfig) {
            onInsert = insertInto("outTable")
            onDelete = deleteFrom("outTable")
            onModify = updateTable("outTable")
        }
    }
}
```

## Supported sources

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

## Supported sinks

Ingress:
- Genesis database (default)
- Custom sinks

Egress:
- All SQL based databases over JDBC are supported.