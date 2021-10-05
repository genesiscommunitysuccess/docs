---
title: Data modelling reference
sidebar_label: Data modelling reference
id: advanced
sidebar_position: 4

---
## Tables

### Primary keys, secondary keys and indices

The Genesis platform provides an abstraction layer so that you can use different database backends (FoundationDB, Aerospike, PostgreSQL) independently of your schema definition.

Genesis uses well known database concepts like primary keys and indexes (unique and non-unique).

However, not all the underlying database technology is the same. For example, Aerospike does not have unique indexes or compound indexes.

Our abstraction layer enables you to ignore these differences as a developer.

You can see an example of the syntax in the USER_SESSION table below.

The primary key for the table is defined after each of the fields has been listed. We don’t declare any key names or key IDs. They are auto-generated. Any time you add/remove fields to an index or key, the name will be changed accordingly. This ensures that names are always consistent with the actual fields of the key/index. This eliminates a lot of potential human error (when, for example, you replace one field for another and forget to change the key name).

An index can be defined as unique or non-unique. The example defines one of each immediately after the primary key. In this example, we want to be able to do record lookups based on SESSION_ID (internal identifier for the session) and SESSION_AUTH_TOKEN (client authentication token), but we would also like to perform range searches based on USER_NAME (which isn’t always unique - a USER can have multiple sessions). By defining a nonUnique index on the USER_NAME field we can store that index in a more efficient way in our database layer and autogenerate optimised getRange operations in the repositories layer.

```kotlin
table(name = "USER_SESSION", id = 2) {
    USER_NAME
    SESSION_ID
    START_TIMESTAMP
    LAST_ACCESS_TIME
    SESSION_AUTH_TOKEN
    TIMEOUT
    HOST
    ATTRIBUTES
    primaryKey {
        SESSION_ID
    }
    indices {
        nonUnique {
            USER_NAME
        }
        unique {
            SESSION_AUTH_TOKEN
        }
    }
}
```

### Subtables

A subtable and provides a unique point of view on the data schema modelling which goes further than a simple join relationship. It gives extra functionality to a main table.

For example, a financial instrument can be modelled as an INSTRUMENT table, but this table won’t be enough to represent all the possible symbologies. So, we use a subtable called ALT_INSTRUMENT_ID, in which the relationship is one to many from INSTRUMENT to ALT_INSTRUMENT_ID.

ALT_INSTRUMENT_ID is likely to inherit key fields from the INSTRUMENT table, and it simply acts as a lookup table for INSTRUMENT records.

This requirement occurs for different tables (e.g. COUNTERPARTY → ALT_COUNTERPARTY_ID, GENESIS_PROCESS → GENESIS_PROCESS_MONITOR, etc.

Subtables are defined within the body of the table definition. The example below shows the GENESIS_PROCESS monitoring table:

```kotlin
table(name = "GENESIS_PROCESS", id = 12) {
    PROCESS_NAME
    PROCESS_STATUS
    PROCESS_STATUS_MESSAGE
    PROCESS_STATE_TEXT
    PROCESS_RESOURCES
    PROCESS_HOSTNAME
    PROCESS_CPU_USAGE
    PROCESS_MEM_USAGE
    PROCESS_SECURE
    PROCESS_PORT
    LOG_LEVEL
    DATADUMP
    START_TIME
    RESOURCE_TYPES
    primaryKey {
        PROCESS_NAME
        PROCESS_HOSTNAME
    }
    subTables {
        fields(PROCESS_HOSTNAME, PROCESS_NAME)
            .joiningNewTable(name = "GENESIS_PROCESS_MONITOR", id = 20) {
                MONITOR_NAME
                MONITOR_MESSAGE
                MONITOR_STATE

            primaryKey(name = "GENESIS_PROCESS_MONITOR_BY_HOSTNAME", id = 1) {
                    PROCESS_HOSTNAME
                    PROCESS_NAME
                    MONITOR_NAME
                }
            }
    }
}
```

In this example, the subtable GENESIS_PROCESS_MONITOR is defined within the GENESIS_PROCESS table. This is shown after the fields and the primary key have been defined.
In the subtable, we first define the fields that are used to generate the join operation. These fields are inherited by the subtable automatically. Then we can define additional fields and keys.