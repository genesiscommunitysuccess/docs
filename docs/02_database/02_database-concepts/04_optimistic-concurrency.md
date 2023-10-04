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

Optimistic Concurrency helps prevent users from updating or deleting a stale version of a record. To do this, we need to know what the intended version of the record to update or delete is. Internally, we use the record's [timestamp](../../fields-tables-views/timestamps) field as its version.

## Configuration

If you want to use Optimistic Concurrency, you must configure it by setting the `DbOptimisticConcurrencyMode` property to the EVENT_HANDLER definition in your  _applicationName_**-processes.xml** file.

The `DbOptimisticConcurrencyMode` property can have one of the following values: `STRICT`, `LAX` and `NONE`. Defaults to `NONE`.

There are two simple ways of setting the property.

In this first example, we simply specify STRICT Optimistic Concurrency as one of the `options`

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
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false -DDbOptimisticConcurrencyMode=STRICT</options>
    <language>pal</language>
</process>
```
Alternatively, you can specify the option in a separate file and use the `configOverridesFile` property. In the example below, the file is called **alpha-sysdef.properties** and we have shown its content in a separate codeblock. 

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

:::warning
Do not apply as a global system definition property, as some internal services cannot operate properly when this is enabled.
:::

## Modes

| Mode             | Description                                                                                                                                                                                                                                                |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `STRICT`         | A check is performed on modify and delete database operations; the TIMESTAMP of the database record must be the same as the TIMESTAMP provided on the event.                                                                                                |
| `LAX`            | A check is performed on modify and delete database operations; if the event has provided a TIMESTAMP, the TIMESTAMP of the database record must be the same as the TIMESTAMP provided on the event. If no timestamp is provided, then no check is performed. |
| `NONE` (Default) | Checks are disabled.           |

## Event Handler entities

The checks are dependent on the availability of a timestamp field. 

- You must make sure that any custom classes used in your Event Handlers have a timestamp field. Add this manually, if necessary. If there is no timestamp field, the database write will fail with an error stating that a TIMESTAMP field is missing.
- Generated entities always have a timestamp field, so the checks will work for these without any extra coding.

### Examples

This `eventHandler` is called TRADE_MODIFY, and it is based on a generated entity.

```kotlin title="trade-eventhandler.kts"
eventHandler<Trade>(name = "TRADE_MODIFY") {
    onCommit { event ->
        val trade = event.details
        entityDb.modify(trade)
        ack()
    }
}
```

Below is an `eventHandler` called TRADE_CANCEL. It is based on a custom class called `TradeCancel`, which itself is described in the second codeblock. 

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
