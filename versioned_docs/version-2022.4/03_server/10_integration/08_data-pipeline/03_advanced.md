---
title: 'Data Pipeline - Advanced'
sidebar_label: 'Advanced'
id: advanced
keywords: [server, integration, data pipeline, advanced]
tags:
  - server
  - integration
  - data pipeline
  - advanced
---

[Introduction](../../../../server/integration/data-pipeline/introduction/)  | [Basics](../../../../server/integration/data-pipeline/basics) | [Advanced](../../../../server/integration/data-pipeline/advanced) | [Examples](../../../../server/integration/data-pipeline/examples) | [Configuring runtime](../../../../server/integration/data-pipeline/configuring-runtime) | [Testing](../../../../server/integration/data-pipeline/testing)

## Enriching data from Genesis Database

The `transform` function of the mappers has the parameter `entityDb`, which can be used to interact with the Genesis database. It provides a CRUD interface and enables you to implement complex use cases, such as enriching data and inserting or updating missing data.

The example below shows mapping a value from the source data to the Genesis database. In this example, if a value is missing, it gets created on the fly.

```kotlin
pipelines {

  postgresSource("cdc-test") {
    hostname = "localhost"
    port = 5432
    username = "postgres"
    password = "docker"
    databaseName = "postgres"

    table {
      "public.trades" to map("e2e-test", TRADE) {

        val instrument = stringValue("inst")

        TRADE {
          INSTRUMENT_ID {
            transform {
              val code: String = input.get(instrument) // The instrument code from the source row
              val instrumentType = "RIC"
              val altInstrumentId: AltInstrumentId? =
              entityDb.get(AltInstrumentId.byCode(code, instrumentType)) // Lookup of the instrument id from the database
              if (altInstrumentId != null) { //if the instrument id exists return it
                altInstrumentId.instrumentCode
              } else { //otherwise create a new one and return it's id
                val newInstrumentId = entityDb.insert(Instrument {
                  instrumentName = ""
                }).record.instrumentId

                entityDb.insert(AltInstrumentId {
                  alternateType = instrumentType
                  instrumentCode = code
                  instrumentId = newInstrumentId
                })

                newInstrumentId
              }
            }
          }
        }
      }
    }
  }
}
```

## System definition properties
System definition variables can be used as part of the source configuration.

```kotlin
pipelines {

  postgresSource("cdc-test") {
    hostname = POSTGRES_HOST
    port = POSTGRES_PORT
    username = DB_USERNAME
    password = DB_PASSWORD
    databaseName = DB_DATABASE_NAME
  }
}
```

Alternatively, you can access `systemDefinition`s in a programmatic way:

```kotlin
pipelines {

  postgresSource("cdc-test") {
    hostname = systemDefinition["db_host"].orElse("localhost")
  }
}
```

It is vital to ensure that any system definition variables that are used by the configuration definition are properly defined in your _application_**-system-definition.kts** file.

## Declaring multiple pipelines

You may declare multiple pipelines in the same .kts file. All sources should be placed within a single `pipelines` block.

```kotlin
pipelines {
    postgresSource("cdc-postgres") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = "docker"
        databaseName = "postgres"

        table {
            // table to mapper definition pairs
        }
    }

    csvSource("cdc-csv") {
        location = "file://some/directory?fileName=example.xml"

        // mapper definition
    }
}
```

## Declaring multiple mapping functions

If you would like to perform different mapping operations over the same data source, you can use multiple mappers.
You can also optionally use a `where` clause to conditionally map rows from your data source. Should the `where` clause be false, no mapping will be performed. These conditional mappers allow you to create more complex and powerful data ingestion pipelines.

For example, if you want to map over a trades source, you could map and transform your data in a different way, depending on the region the trade was made:

```kotlin
pipelines {
    csvSource("cdc-csv") {

        location = "file://some/directory?fileName=example.xml"

        map("EMEA-order", TABLE_OBJECT) {
            where { input.get(stringValue("region") == "emea") }

            FIELD {}
            ...
        }

        map("NAM-order", TABLE_OBJECT) {
            where { input.get(stringValue("region") == "nam") }

            FIELD {}
            ...
        }
    }
}
```

## Auditable sink operations

All database operations are audited if the table is declared as [auditable](../../../../database/data-types/table-entities/#auditable-tables). Each sink operation is then stored to the audit table with the default event type of `custom-sink-operation`. However, you can change this by passing another type as an argument to the `sink` function:

```kotlin
pipelines {
    postgresSource("cdc-postgres") {

        ...

        map(someMap).sink("delete-sell-trades") {
            if (mappedEntity.tradeType == "sell") {
                entityDb.delete(mappedEntity)
            } else {
                entityDb.insert(mappedEntity)
            }
        }
    }
}
```

You can also define multiple sink functions that are then executed separately. This can be useful when defining sinks as variables for later reuse in multiple pipelines.

```kotlin
pipelines {
    postgresSource("cdc-postgres") {

        ...

        map(someMap).sink(someSink).sink(someOtherSink)
    }
}
