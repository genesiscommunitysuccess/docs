---
sidebar_position: 1
title: Introduction
sidebar_label: Introduction
id: overview

---

[Introduction](/creating-applications/defining-your-application/integrations/data-pipeline/overview/)  | [Where to define](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-where-to-define/) | [Basics](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-basics/) | [Advanced](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/) | [More examples](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/) | [Configuring runtime](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-runtime/) | [Testing](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-testing/)


You can define data pipelines that map data from an external source (database, file) to [Tables](/creating-applications/defining-your-application/data-model/tables/tables) in your application. The resulting [Table](/creating-applications/defining-your-application/data-model/tables/tables) objects are stored in the database.

Each data pipeline defines a source for the data and how that data is mapped to each [Field](/creating-applications/defining-your-application/data-model/fields/fields) in the [Table](/creating-applications/defining-your-application/data-model/tables/tables). 

If the mapping is not one-to-one - e.g. complex type conversions, data obfuscation, enriched values - you can define a `transform` function whose value will be mapped to the [Field](/creating-applications/defining-your-application/data-model/fields/fields)

The following is a sample configuration that sources data from PostgreSQL:
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

Broadly, you need to create new data pipeline script and start the platform. Once it's running, the data ingestion will take place.

## Supported sources
- PostgreSQL
- CSV, XML and JSON files that originate from the local filesystem or over FTP and S3
