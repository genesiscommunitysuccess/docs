---
title: 'Database concepts - Optimistic Concurrency'
sidebar_label: 'Optimistic Concurrency'
id: optimistic-concurrency
keywords: [ database, concepts, optimistic concurrency, optimistic locking ]
tags:
  - database
  - concepts
  - optimistic concurrency
  - optimistic locking
---

Optimistic Concurrency helps prevent users from updating or deleting a stale version of a record. To do this we need to
know what the intended version of the record to update or delete is. Internally, we use the
record's [timestamp](../../fields-tables-views/timestamps) field as its version.

## Configuration

Optimistic Concurrency is configured with the `DbOptimisticConcurrencyMode` system definition property.

Available values: `STRICT`, `LAX` and `NONE`. Defaults to `NONE`.

:::warning
Do not apply as a global system definition property as some internal services cannot operate properly with it enabled.
:::

Instead, apply on a per-process basis in the _applicationName_-processes.xml file with either `configOverridesFile`
or `options`.

e.g. Configuring using configOverridesFile

```xml title="alpha-processes.xml"

<process name="ALPHA_EVENT_HANDLER">
    <groupId>ALPHA</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
    <module>genesis-pal-eventhandler</module>
    <package>global.genesis.eventhandler.pal</package>
    <script>alpha-eventhandler.kts</script>
    <description>Handles events</description>
    <classpath>alpha-messages*,alpha-eventhandler*</classpath>
    <configOverridesFile>alpha-sysdef.properties</configOverridesFile>
    <language>pal</language>
</process>
```

```properties title="alpha-sysdef.properties"
DbOptimisticConcurrencyMode=STRICT
```

## Modes

| Mode             | Description                                                                                                                                                                                                                                                |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `STRICT`         | A check is performed on modify and delete database operations that the TIMESTAMP of the database record is the same as the TIMESTAMP provided on the event.                                                                                                |
| `LAX`            | A check is performed on modify and delete database operations that the TIMESTAMP of the database record is the same as the TIMESTAMP provided on the event, if the event has provided a TIMESTAMP. If no timestamp is provided then no check is performed. |
| `NONE` (Default) | Checks are disabled.                                                                                                                                                                                                                                       |

## Event Handler

- Automatically works for generated entities as they already have a timestamp field.
- For custom classes used in event handlers, a timestamp field will need to be manually added. If the timestamp field is
  not added then the database write will fail with an error stating that a TIMESTAMP field is missing.

### Examples

#### Generated entity

TRADE_MODIFY Event Handler

```kotlin title="trade-eventhandler.kts"
eventHandler<Trade>(name = "TRADE_MODIFY") {
    onCommit { event ->
        val trade = event.details
        entityDb.modify(trade)
        ack()
    }
}
```

#### Custom event class

TRADE_CANCEL Event Handler

```kotlin title="trade-eventhandler.kts"
eventHandler<TradeCancel> {
    onCommit { event ->
        val message = event.details
        val trade = Trade {
            tradeStatus = TradeStatus.CANCELLED
        }
        trade.timestamp = message.timestamp
        entityDb.modify(trade)
        ack()
    }
}
```

`TradeCancel` Kotlin data class

```kotlin title="TradeCancel.kt"
data class TradeCancel(
    val tradeId: String,
    val timestamp: Long,
)
```

## Linking with the front end

When sending an event to the server, the front end needs to know what timestamp to send as part of the payload.

The front end side of Optimistic Concurrency is driven from [Entity Management](../../../web/micro-front-ends/foundation-entity-management). You will need to set up the relevant
Data Server query or Req Rep for entity management.

### Data Server

- Automatically works when no specific fields have been defined for data server query.
- Where specific fields have been defined for a data server query, you will need to add the TIMESTAMP field additionally.

#### Examples

No specific fields defined:

```kotlin title="trade-dataserver.kts"
query("ALL_TRADES", TRADE)
```

Specific fields defined:

```kotlin title="trade-dataserver.kts"
query("ALL_TRADES", TRADE) {
    fields {
        TRADE_ID
        QUANTITY
        PRICE
        TIMESTAMP
    }
}
```

### Req Rep

- Automatically works when no specific fields have been defined for reply.
- Where specific fields have been defined for the reply, you will need to add the TIMESTAMP field additionally.

#### Examples

No specific fields defined:

```kotlin title = trade-reqrep.kts
requestReply(TRADE)
```

Specific fields defined:

```kotlin title = trade-reqrep.kts
requestReply("TRADE", TRADE) {

  request {
    TRADE_ID
  }

  reply {
    TRADE_ID
    QUANTITY
    PRICE
    TIMESTAMP
  }
}
```
