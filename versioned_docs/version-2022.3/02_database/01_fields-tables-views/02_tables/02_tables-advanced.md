---
title: 'Tables - advanced'
sidebar_label: 'Tables - advanced'
id: tables-advanced
keywords: [database, tables, advanced]
tags:
    - database
    - tables
    - advanced
---


## Subtables

A subtable provides a unique point of view on the data schema, which goes further than a simple join relationship. It gives extra functionality to a main table.

For example, a financial instrument can be modelled as an INSTRUMENT table, but this table on its own isn’t enough to represent all the possible symbologies for an instrument. So, we could add a subtable called ALT_INSTRUMENT_ID, in which the relationship is one-to-many from INSTRUMENT to ALT_INSTRUMENT_ID.

ALT_INSTRUMENT_ID is likely to inherit key fields from the INSTRUMENT table, and it simply acts as a lookup table for INSTRUMENT records.

This requirement occurs for different tables (e.g. COUNTERPARTY → ALT_COUNTERPARTY_ID, GENESIS_PROCESS → GENESIS_PROCESS_MONITOR, etc).

Subtables are defined within the body of the table definition. 

The example below shows the `GENESIS_PROCESS` monitoring table.

After the fields and the primary key have been defined, you can see the subtable `GENESIS_PROCESS_MONITOR`.

Within this subtable, the fields that are used to generate the join operation are defined first. These fields are inherited automatically. Then the additional fields and keys are defined.


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



