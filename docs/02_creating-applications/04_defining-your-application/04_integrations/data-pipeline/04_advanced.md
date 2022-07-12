---
sidebar_position: 4
title: Advanced
sidebar_label: Advanced
id: datapipeline-advanced

---

[Introduction](/creating-applications/defining-your-application/integrations/data-pipeline/overview/)  | [Where to define](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-where-to-define/) | [Basics](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-basics/) | [Advanced](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/) | [More examples](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/) | [Configuring runtime](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-runtime/) | [Testing](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-testing/)

## Interacting with the database
The `transform` function of the mappers has the parameter `entityDb`, which can be used to interact with the Genesis database. It provides a CRUD interface and enables you to implement complex use cases, such as enriching data and inserting or updating missing data. 

The example below shows mapping a value from the source data to the Genesis database. In this example, if a value is missing, it gets created on the fly.

```kotlin
sources {

  postgres("cdc-test") {
    hostname = "localhost"
    port = 5432
    username = "postgres"
    password = "docker"
    databaseName = "postgres"

    table {
      "public.trades" to mapper("e2e-test", TRADE) {

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
sources {

  postgres("cdc-test") {
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
sources {

  postgres("cdc-test") {
    hostname = systemDefinition["db_host"].orElse("localhost")
  }
}
```

It is vital to ensure that any system definition variables that are used by the configuration definition are properly defined in your __application__**-system-definition.kts** file.

## PostgreSQL configuration
To capture changes from PostgreSQL the following requirements must be met:
 - The Write Ahead Log level has to be set at least to `logical`. The setting for this is `wal_level`.
 - The plugin used for logical decoding must be `pgoutput` (which is the default plugin PostgreSQL uses).
 - [`max_wal_senders`](https://www.postgresql.org/docs/current/runtime-config-replication.html) must be set to a value greater than zero. PostgreSQL default value is `10`.
 - [`max_replication_slots`](https://www.postgresql.org/docs/current/runtime-config-replication.html) must be set to a value greater than zero. PostgreSQL default value is `10`.

## Replaying PostgreSQL rows
While processing source data, Genesis keeps track of the last processed row. If the server gets restarted, it will use the last recorded offset to know where in the source information it should resume reading from.  The offsets are kept in a table called `DATAPIPELINE_OFFSET` and there is one record per connector. If you want to start ingesting the rows from the begining, delete the row with the name of the source connector and restart the Genesis server.
