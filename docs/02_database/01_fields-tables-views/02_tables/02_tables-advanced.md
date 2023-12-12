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

## Automatically generated sequences

There are two keywords that enable you to define a field that automatically generates a sequence number (such as you would need for identifying a new trade or a new order):

- `autoIncrement`, which simply generates an integer value in sequence; by default, the first number generated will be 1
- `sequence`, which generates either a [UUID](https://www.uuidtools.com/what-is-uuid) or a value in a Genesis format (see below), depending on the database technology you are using

:::info
For all new development, we recommended that you use `autoIncrement` fields rather than `sequence`.

There is no known efficiency between one keyword and the other. But `autoIncrement`is easier to define and generates a simple integer with no padding or leading zeroes; it keeps things simple.
:::

## Default format when using sequence

When you use the keyword `sequence` to generate sequence numbers, the value generated is actually a combination of sequence number and other parameters defined in your application's System definition. For example, a table with the field `TRADE_ID` defined as:

```kotlin
table (name = "TRADE", id = 2000) {
        sequence(TRADE_ID, "TR")
        QUANTITY
        PRICE
        SYMBOL
        DIRECTION

        primaryKey {
            TRADE_ID
        }
    }
```

will generate `TRADE_ID` fields in the following format: `SEQUENTIAL_VALUE` (padded by `paddingSize`) + `SEQUENCE` + `LOCATION` + 1 (fixed)

Using the default settings (see details below), the first value generated for the field defined above will be: `000000000000001TRLO1`

### Using sequence with an SQL database (UUID)

If you are using an SQL database, `sequence` behaves differently by default; it generates a `UUID`.

To switch off UUID generation and use the default Genesis format for `sequence`:

1. Add or modify the following keys in the file **site-specific/genesis-system-definition.kts**:

| Item | Default Value | Description
| ---- | ------------- | -----------
| Location | 'LO' | 
| SqlSequencePaddingSize| 15 | The number of zeros used to pad the sequential number.
| SqlEnableSequenceGeneration | false | Must be set to true.

2. Run 'genesisInstall` to apply the settings.

3. If you have any new or changed sequences, run `remap` to generate any new database sequences.

4. If there are existing fields using sequences, run the server command [CreateMissingSqlSequences](../../../05_operations/02_commands/01_server-commands.md#createmissingsqlsequences).

5. If you need to adjust the initial value of the sequences (for example if you are migrating data), use the server command [SetAutoIncrement](../../../05_operations/02_commands/01_server-commands.md#setautoincrement).

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


