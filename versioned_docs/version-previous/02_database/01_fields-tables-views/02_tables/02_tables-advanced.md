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

Within the body of the table definition, you can use `subtables` to define one or more subtables. A subtable provides a unique point of view on the data schema, which goes further than a simple join relationship. It gives extra functionality to a main table.

For example, you might have an EXECUTION_VENUE table to provide details of different exchanges and trading venues. This table on its own probably cannot represent all the possible symbologies for an exchange. So, you could add a subtable called ALT_VENUE_CODE, in which the relationship is one-to-many from EXECUTION_VENUE_ID to ALT_VENUE_CODE.

ALT_VENUE_CODE inherits key fields from the EXECUTION_VENUE table, and it simply acts as a lookup table for EXECUTION_VENUE records.

The example below shows this.

After the fields and the primary key have been defined, you can see the subtable `ALT_VENUE_CODE`.

- The EXECUTION_VENUE_ID field is used to generate the join operation. This field is inherited automatically.
- Then the additional fields ALT_VENUE_CODE and ALT_VENUE_CODE_TYPE are defined.
- Then the key for the subtable is defined.

```kotlin
    table(name = "EXECUTION_VENUE", id = 5043) {
        Fields.COUNTRY_CODE
        Fields.OPERATING_MIC
        Fields.DESCRIPTION
        Fields.EXECUTION_VENUE_ID

        primaryKey(name = "EXECUTION_VENUE_BY_EXECUTION_VENUE_ID", id = 1){
            Fields.EXECUTION_VENUE_ID
        }
        subTables {
            fields(Fields.EXECUTION_VENUE_ID)
                .joiningNewTable(name = "ALT_VENUE_CODE", id = 5044) {
                    Fields.ALT_VENUE_CODE
                    Fields.ALT_VENUE_CODE_TYPE

                    primaryKey(name = "ALT_VENUE_CODE_BY_EXECUTION_VENUE_ID_ALT_VENUE_CODE_TYPE", id = 1) {
                        Fields.EXECUTION_VENUE_ID
                        Fields.ALT_VENUE_CODE_TYPE
                    }
                }
        }
    }
```
Some tables provided by the platform have subtables. The example below shows the `GENESIS_PROCESS` monitoring table, which includes a subtable called `GENESIS_PROCESS_MONITOR`.

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


