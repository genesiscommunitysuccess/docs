---
id: mappers
title: Declare Source and Mappers
sidebar_label: Declare Source and Mappers
sidebar_position: 3

---

In this part of the tutorial we will declare the PostgreSQL server as a data source and map the incoming rows to a Genesis [Table](https://docs.genesis.global/secure/creating-applications/defining-your-application/data-model/tables/tables/) object.

## Declare Data Source

To define the data pipeline, start by defining the data source. Open `trades-data-pipeline.kts` under `datapipeline-sandbox/server/jvm/datapipeline-trades-script-config/src/main/resources/cfg` (if you chose another project name don't forget to replace `datapipeline-trades` with it) fill in the following.

In this example the `hostname` needs to be set to the address of the PostgreSQL server.

```kotlin
sources {

    postgres("trade-pipeline") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = systemDefinition.getItem("CdcPostgresPassword").toString()
        databaseName = "postgres"

    }
}
```

## Declare the Mapper

```kotlin
sources {

    postgres("trade-pipeline") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = systemDefinition.getItem("CdcPostgresPassword").toString()
        databaseName = "postgres"

        table {
            "public.trades" to mapper("e2e-test", TRADE) {

                TRADE {
                    TRADE_ID {
                        sourceProperty = "TRADE_ID"
                    }
                }
            }
        }
    }
```