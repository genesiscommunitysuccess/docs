---
sidebar_position: 4
title: Advanced
sidebar_label: Advanced
id: datapipeline-advanced

---

[Introduction](/creating-applications/defining-your-application/integrations/data-pipeline/overview/)  | [Where to define](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-where-to-define/) | [Basics](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-basics/) | [Advanced](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/) | [More examples](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/) | [Configuring runtime](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-runtime/) | [Testing](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-testing/)

## Interacting with the database
The `transform` function of the mappers has parameter `entityDb` that can be used to interact with the underlying Genesis database. It provides CRUD interface and allows developers to implement complex use cases like enriching data and inserting or updating missing data. The following is an example for mapping a value from the source data to the underlying database. Also in the case that value is missing it gets created on the fly.

```kotlin
sources {

  postgresSource("cdc-test") {
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

## Using System Definition Properties
System definition variables can be used as part of the source configuration.

```kotlin
sources {

  postgresSource("cdc-test") {
    hostname = POSTGRES_HOST
    port = POSTGRES_PORT
    username = DB_USERNAME
    password = DB_PASSWORD
    databaseName = DB_DATABASE_NAME
  }
}
```

or you can access `systemDefinition`s in a programatic way:

```kotlin
sources {

  postgresSource("cdc-test") {
    hostname = systemDefinition["db_host"].orElse("localhost")
  }
}
```

It is vital to ensure that any system definition variables that are used by the configuration definition are properly defined in your __application__**-system-definition.kts** file.

## PostgreSQL configuration
To capture changes from PostgreSQL the Write Ahead Log level has to be set at least to `logical` and the plugin used for logical decoding to be `pgoutput` (which is the default plugin PostgreSQL uses).

## Replaying PostgreSQL rows
Genesis keeps track of the last processed row from the source database in a table called `DEBEZIUM_OFFSET`. If you want to start ingesting the rows from the begining you can delete the row with the name of the source and restart the Genesis server