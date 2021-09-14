---
sidebar_label: Data modelling reference
id: data-model-adv

---
# Data modelling reference

## Tables
### Primary keys, secondary keys and indices
The Genesis platform provides an abstraction layer so that you can use different database backends (FoundationDB, Aerospike, PostgreSQL) independently of your schema definition. 

Genesis uses keys, which can be primary or secondary. In an SQL world, the closest similarity would be: 

Genesis primary key → SQL primary key
Genesis secondary key → SQL unique index definition.

However, not all the underlying database technology is the same. For example, Aerospike does not have unique indexes or compound indexes.

Our abstraction layer enables you to ignore these differences as a developer.

You can see an example of the syntax in the USER_SESSION table below.

:::danger WIP
(There are no line numbers now we are not using confluence. I need to rewrite the examples here, because there are numerous specific references.)
:::

The primary key for the table is defined in lines 10-13. We don’t declare any key names or key IDs. They are auto-generated. Any time you add/remove fields to an index or key, the name will be changed accordingly. This ensures that names are always consistent with the actual fields of the key/index. This eliminates a lot of potential human error (when, for example, you replace one field for another and forget to change the key name).

An index can be defined as unique or non-unique. The example defines one of each (lines 13-20). In this example, we want to be able to do record lookups based on SESSION_ID (internal identifier for the session) and SESSION_AUTH_TOKEN (client authentication token), but we would also like to perform range searches based on USER_NAME (which isn’t always unique - a USER can have multiple sessions). By defining a nonUnique index on the USER_NAME field we can store that index in a more efficient way in our database layer and autogenerate optimised getRange operations in the repositories layer.

```sql
    table(name = "USER_SESSION", id = 2) {
        Fields.USER_NAME
        Fields.SESSION_ID
        Fields.START_TIMESTAMP
        Fields.LAST_ACCESS_TIME
        Fields.SESSION_AUTH_TOKEN
        Fields.TIMEOUT
        Fields.HOST
        Fields.ATTRIBUTES
        primaryKey {
            Fields.SESSION_ID
        }
        indices {
            nonUnique {
                Fields.USER_NAME
            }
            unique {
                Fields.SESSION_AUTH_TOKEN
            }
        }
    }
```

### Subtables
A subtable and provides a unique point of view on the data schema modelling which goes further than a simple join relationship. It gives extra functionality to a main table. 

For example, a financial instrument can be modelled as an INSTRUMENT table, but this table won’t be enough to represent all the possible symbologies. So, we use a subtable called ALT_INSTRUMENT_ID, in which the relationship is one to many from INSTRUMENT to ALT_INSTRUMENT_ID. 

ALT_INSTRUMENT_ID is likely to inherit key fields from the INSTRUMENT table, and it simply acts as a lookup table for INSTRUMENT records.  

This requirement occurs for different tables (e.g. COUNTERPARTY → ALT_COUNTERPARTY_ID, GENESIS_PROCESS → GENESIS_PROCESS_MONITOR, etc..

Subtables are defined within the body of the table definition. The example below shows the GENESIS_PROCESS monitoring table:


```sql
table(name = "GENESIS_PROCESS", id = 12) {
    Fields.PROCESS_NAME
    Fields.PROCESS_STATUS
    Fields.PROCESS_STATUS_MESSAGE
    Fields.PROCESS_STATE_TEXT
    Fields.PROCESS_RESOURCES
    Fields.PROCESS_HOSTNAME
    Fields.PROCESS_CPU_USAGE
    Fields.PROCESS_MEM_USAGE
    Fields.PROCESS_SECURE
    Fields.PROCESS_PORT
    Fields.LOG_LEVEL
    Fields.DATADUMP
    Fields.START_TIME
    Fields.RESOURCE_TYPES
    primaryKey {
        Fields.PROCESS_NAME
        Fields.PROCESS_HOSTNAME
    }
    subTables {
        fields(Fields.PROCESS_HOSTNAME, Fields.PROCESS_NAME)
            .joiningNewTable(name = "GENESIS_PROCESS_MONITOR", id = 20) {
                Fields.MONITOR_NAME
                Fields.MONITOR_MESSAGE
                Fields.MONITOR_STATE

primaryKey(name = "GENESIS_PROCESS_MONITOR_BY_HOSTNAME", id = 1) {
                    Fields.PROCESS_HOSTNAME
                    Fields.PROCESS_NAME
                    Fields.MONITOR_NAME
                }
            }
    }
}
```

In this example, the subtable GENESIS_PROCESS_MONITOR is defined (starting at line 20) within the GENESIS_PROCESS table, We first define the fields that are used to generate the join operation (lines 23-25), and these fields are inherited by the subtable automatically. Then we can define additional fields and keys (lines 27-30).