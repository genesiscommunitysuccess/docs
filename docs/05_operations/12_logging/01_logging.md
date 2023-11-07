---
title: 'Logging'
sidebar_label: 'Logging'
id: tracing
keywords: [operations, logging]
tags:
    - operations
    - logging
---

This page relates to Server logging.

## Logging level

The logging level can be modified in the [processes xml](../../../server/configuring-runtime/processes/#logginglevel) file.

## Logging context

Additional contextual attributes can be added to log statements. If enabled, the context is added on inbound requests/messages and propagated through the system.

Genesis makes use of slf4j's [MDC](https://www.slf4j.org/api/org/slf4j/MDC.html) to add this contextual information.

### Context attributes

The following Genesis-specific attributes are added to the logging context:

- Message Type
- Source Ref
- Username (if present)
- Payload

### Example

The below shows example values for the Genesis-specific attributes listed previously.


| Attribute            | Value                                                          |
|----------------------|----------------------------------------------------------------|
| genesis.message_type | EVENT_TRADE_INSERT                                             |
| genesis.source_ref   | 6045bdfffe1177d3-00005df4-00000004-1f1e5fe74723987e-c672dc68:1 |
| genesis.username     | JohnDoe                                                        |
| genesis.payload      | {"MESSAGE_TYPE":"EVENT_TRADE_INSERT","USER_NAME":"JohnDoe","SESSION_AUTH_TOKEN":"********","REFRESH_AUTH_TOKEN":null,"VALIDATE":false,"IGNORE_WARNINGS":true,"DETAILS":{"INSTRUMENT_ID":"VOD","COUNTERPARTY_ID":"GENESIS","QUANTITY":10,"PRICE":1.5,"SIDE":"BUY"},"SOURCE_REF":"1"}                                                          |

## Set-up

To enable Genesis attributes to be added to the logging context, set the `LoggingContextEnabled` system definition property to `true`. This property defaults to `false`.

```kotlin
item(name = "LoggingContextEnabled", value = "true")
```

You can then configure your logging configuration file as normal to show MDC attributes.

If [Tracing](../../../operations/tracing/tracing) is enabled, then additional tracing information is also available in MDC, see [here](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/docs/logger-mdc-instrumentation.md) for more details.

### Example log4j2 configuration

Show all MDC attributes:

```xml
<Pattern>%d{dd MMM yyyy HH:mm:ss.SSS} %-4relative [%t] %-5level %logger{35} [%X] - %m%n</Pattern>
```

Show just the Source Ref attribute:

```xml
<Pattern>%d{dd MMM yyyy HH:mm:ss.SSS} %-4relative [%t] %-5level %logger{35} [SourceRef = %X{genesis.source_ref}] - %m%n</Pattern>
```

Show all MDC attributes in json format:

```xml
<JsonLayout complete="false" compact="true" eventEol="true" properties="true"  />
```

Show just the Source Ref attribute in json format:

```xml
<JsonLayout complete="false" compact="true" eventEol="true" >
    <KeyValuePair key="SourceRef" value="${ctx:genesis.source_ref}"/>
</JsonLayout>
```
