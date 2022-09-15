---
title: 'Advanced'
sidebar_label: 'Advanced'
id: advanced
---

[Introduction](/server/integration/data-pipeline/introduction/)  | [Basics](/server/integration/data-pipeline/basics) | [Advanced](/server/integration/data-pipeline/advanced) | [Examples](/server/integration/data-pipeline/examples) | [Configuring runtime](/server/integration/data-pipeline/configuring-runtime) | [Testing](/server/integration/data-pipeline/testing)

## PostgreSQL

### Interacting with the database
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

It is vital to ensure that any system definition variables that are used by the configuration definition are properly defined in your _application_**-system-definition.kts** file.

## PostgreSQL configuration
To capture changes from PostgreSQL, the following configuration has to be in place:

| Setting | Value |
|---|---|
| wal_level | logical |
| max_wal_senders | greater than 1 (default value is 10) |
| max_replication_slots | greater than 1 (default value is 10) |

[Here](https://www.postgresql.org/docs/current/runtime-config-replication.html) you can find more information about these settings.

## Declaring multiple sources

You may declare multiple sources in the same kts file. All sources should be placed within a single `sources` block.

```kotlin
sources {
    postgres("cdc-postgres") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = "docker"
        databaseName = "postgres"

        table {
            // table to mapper definition pairs
        }
    }

    csv("cdc-csv") {
        location = "file://some/directory?fileName=example.xml"

        // mapper definition
    }
}
```

## Declaring multiple mappers

If you would like to perform different mapping operations over the same data source, you can use multiple mappers.
You can also optionally use a `where` clause to conditionally map rows from your data source. Should the `where` clause be false, no mapping will be performed. These conditional mappers allow you to create more complex and powerful data ingestion pipelines.

For example, if you want to map over a trades source, you could map and transform your data in a different way, depending on the region the trade was made:

```kotlin
sources {
    csv("cdc-csv") {

        location = "file://some/directory?fileName=example.xml"

        mapper("EMEA-order", TABLE_OBJECT) {
            where { input.get(stringValue("region") == "emea") }

            FIELD {}
            ...
        }

        mapper("NAM-order", TABLE_OBJECT) {
            where { input.get(stringValue("region") == "nam") }

            FIELD {}
            ...
        }
    }
}
```


## Custom handler for the mapped entity

The default behaviour of a data pipeline is to store the mapped [Table](/database/fields-tables-views/tables/) object to the Genesis database. However, there are cases when you might want to actually delete or modify that entity, or do other conditional operations. For those cases, the `sink` function can be used. The function has two parameters:

- `entityDb` - object to access the underlying Genesis database
- `mappedEntity` - the mapped Table object

Recognising that inserting, modifying or deleting mapped entities will be the most commonly used operations, those are already defined under `SinkOperations`:

- `SinkOperations.INSERT`
- `SinkOperations.MODIFY`
- `SinkOperations.DELETE`

They can be used like this:

```kotlin
sources {
    postgres("cdc-postgres") {

        ...

        mapper("EMEA-order", TABLE_OBJECT) {
            sink(SinkOperations.DELETE)

            FIELD {}
            ...
        }

    }
}
```

This can be combined with the `where` function from the previous paragraph and give you the ability to delete or modify certain records without mapping each one:

```kotlin
sources {
    postgres("cdc-postgres") {

        ...

        mapper("EMEA-order", TABLE_OBJECT) {
            sink(SinkOperations.DELETE)

            where { input.get(stringValue("side") == "sell") }

            FIELD {}
            ...
        }

    }
}
```

In other cases when you want to act based on the state of the mapped entity, you can declare a custom sink method:

```kotlin
sources {
    postgres("cdc-postgres") {

        ...

        mapper("EMEA-order", TABLE_OBJECT) {
            sink {
                if (mappedEntity.tradeType == "sell") {
                    entityDb.delete(mappedEntity)
                } else {
                    entityDb.insert(mappedEntity)
                }
            }

            FIELD {}
            ...
        }

    }
}
```

Note that all database operations are audited if the table is declared as [auditable](/database/data-types/table-entities/#auditable-tables). Each sink operation is then stored to the audit table with the default event type of `custom-sink-operation`. However, you can change this by passing another type as argument to the `sink` function:

```kotlin
sources {
    postgres("cdc-postgres") {

        ...

        mapper("EMEA-order", TABLE_OBJECT) {
            sink("delete-sell-trades") {
                if (mappedEntity.tradeType == "sell") {
                    entityDb.delete(mappedEntity)
                } else {
                    entityDb.insert(mappedEntity)
                }
            }

            FIELD {}
            ...
        }

    }
}
```
