---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---

[Introduction](/server-modules/integration/data-pipeline/introduction/)  | [Basics](/server-modules/integration/data-pipeline/basics) | [Advanced](/server-modules/integration/data-pipeline/advanced) | [Examples](/server-modules/integration/data-pipeline/examples) | [Configuring runtime](/server-modules/integration/data-pipeline/configuring-runtime) | [Testing](/server-modules/integration/data-pipeline/testing)

You can define data pipelines that map data from an external source (database, file) to [Tables](/creating-applications/defining-your-application/data-model/tables/tables) in your application. By default, the resulting [Table](/creating-applications/defining-your-application/data-model/tables/tables) objects are stored in the database. However, you can define[custom operations](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/#custom-handler-for-the-mapped-entity) as well.

Each data pipeline defines a source for the data and how that data is mapped to each [Field](/creating-applications/defining-your-application/data-model/fields/fields) in the [Table](/creating-applications/defining-your-application/data-model/tables/tables).

If a field mapping is not one-to-one - e.g. complex type conversions, data obfuscation, enriched values - you can define a `transform` function that has a return value that is mapped to the required [Field](/creating-applications/defining-your-application/data-model/fields/fields).

Here is a sample configuration:
```kotlin
sources {

    postgres("cdc-test") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = "docker"
        databaseName = "postgres"

        table {
            "public.source_trades" to mapper("incoming_trades", TRADE) {
                val tradeId = stringValue("trd_id")
                val tradedAt = longValue("traded_at")

                TRADE {

                    TRADE_TYPE {
                        sourceProperty = "side"
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

## Supported sources
Currently, the supported sources are:
- PostgreSQL
- MS SQL Server
- Oracle Enterprise
- Files that originate from the local filesystem or S3
    - CSV
    - XML
    - JSON
