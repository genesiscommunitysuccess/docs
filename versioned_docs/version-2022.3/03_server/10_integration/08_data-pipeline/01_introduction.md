---
title: 'Data Pipeline - Introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, integration, data pipeline, introduction]
tags:
  - server
  - integration
  - data pipeline
  - introduction
---

[Introduction](/server/integration/data-pipeline/introduction/)  | [Basics](/server/integration/data-pipeline/basics) | [Advanced](/server/integration/data-pipeline/advanced) | [Examples](/server/integration/data-pipeline/examples) | [Configuring runtime](/server/integration/data-pipeline/configuring-runtime) | [Testing](/server/integration/data-pipeline/testing)

You can define pipelines that map data from an external source (database, file) to [Tables](/database/fields-tables-views/tables/) in your application. By default, the resulting Table objects are stored in the database. However, you can define [custom operations](/server/integration/data-pipeline/advanced/#custom-handler-for-the-mapped-entity) as well.

Each data pipeline defines a source for the data and how that data is mapped to each [Field](/database/fields-tables-views/fields/) in the Table.

If a field mapping is not one-to-one - e.g. complex type conversions, data obfuscation, enriched values - you can define a `transform` function that has a return value that is mapped to the required field.

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
