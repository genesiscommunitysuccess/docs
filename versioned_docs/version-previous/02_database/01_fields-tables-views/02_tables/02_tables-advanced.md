---
title: 'Tables - advanced'
sidebar_label: 'Tables - advanced'
id: tables-advanced
keywords: [database, tables, advanced, autoIncrement, subtable]
tags:
    - database
    - tables
    - advanced
    - autoIncrement
    - subtable
---

## Sequences

To create a field that automatically generates the next number in a sequence when a new record is created, use the `autoIncrement` keyword. This needs a field of type INT.

So for example, if you want to generate a numeric trade ID for every new trade, you would have the following field in your **fields-dictionary.kts**:

```
field("TRADE_ID_INT", type = INT)
```

And you would use the `autoIncrement` keyword in your table definition:

```kotlin
table (name= "EXTERNAL_TRADE", id = 2100) {
    autoIncrement(TRADE_ID_INT)

    QUANTITY
    PRICE
    SYMBOL
    COUNTERPARTY_ID

    primaryKey { 
       TRADE_ID_INT
    }
}
```

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

## Audit tables

If you want to be able to track the changes made to a table, you need an audit table. This is useful, for example, if you want to:

- keep track of the changes to trades, with times and modifications, to provide an accurate record of events
- be able to roll back to a specific time following an outage

Audit tables don't exist in isolation. They exist to audit activity on a source table. To create an audit table, you simply need to include the parameter `audit = details()` when you define the source table itself. The syntax is:


```kotlin 
table (name = <TABLE_NAME>, id = <TABLE_ID>, audit = details(id = <TABLE_NAME_AUDIT_ID>, sequence = <TABLE_SEQUENCE>, tskey = <TRUE_OR_FALSE>))
        ...

```

The following details can be added when you use the `audit = details()`parameter:

| Parameter name            | Type | Description |
| ---                       | ---       | ---  |
| `id`    | Integer  | **Unique** `id` to identify the audit table |
| `sequence`        | STRING    | **Unique** name to identify its `sequence`   | 
| `tskey`        | boolean  | Set a timestamp index |


The audit table that is created has the same name as the source table, plus the suffix **_AUDIT**. Here is an example table definition, which creates a table called `EUR_TRADES` and an audit table called `EUR_TRADES_AUDIT`:

```kotlin {1}
table (name = "EUR_TRADE", id = 2000, audit = details(id = 2100, sequence = "TR")) {
    sequence(TRADE_ID, "TR")
    COUNTERPARTY_ID 
    INSTRUMENT_ID not null
    QUANTITY
    PRICE not null
    TRADE_DATE
    TRADE_STATUS

    primaryKey {
        TRADE_ID
    }
}
```

Whenever an `eventHandler` interacts with the table `EUR_TRADES`, a record is automatically inserted to the audit table `EUR_TRADES_AUDIT`to log the event.

So, to be clear:

- An audit table monitors and logs details of changes on a specific table. 
- If the table and the `eventHandlers` that interact with it are set up correctly, then the auditing is performed automatically. 
- Every change to the table is automatically logged and timestamped on the audit table.

### Structure of audit tables

When you create an audit table, it has all the same fields as the source table, plus the following fields:

| Field name                | Data Type | Description |
| ---                       | ---       | ---  |
| `AUDIT_EVENT_DATETIME`    | DATATIME  | Autogenerated date and time of the event  |
| `AUDIT_EVENT_TEXT`        | STRING    | Optional “REASON” value sent as part of the event message | 
| `AUDIT_EVENT_TYPE`        | STRING    | Event that wrote on the source table |
| `AUDIT_EVENT_USER`        | STRING    | User on the event message |
 
### ACID
Every `eventHandler` that interacts with the audited table must be [transactional](../../../../server/event-handler/basics/#transactional-event-handlers-acid). This ensures [ACID](../../../../getting-started/glossary/glossary/#acid) compliance.

Here is a simple example of a transactional `eventHandler`:

```kotlin

    eventHandler<Company>(name = "COMPANY_INSERT", transactional = true) {
        onValidate {
            ack()
        }
        onCommit { event ->
            val company = event.details
            entityDb.insert(company)
            ack(listOf(mapOf("VALUE" to "SUCCESS!")))
        }
    }
```

:::warning
Make sure your database supports transactions.
:::


