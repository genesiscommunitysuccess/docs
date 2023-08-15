---
title: 'Tracing'
sidebar_label: 'Tracing'
id: tracing
keywords: [operations, tracing]
tags:
    - operations
    - tracing
---

The Genesis Tracing module enables you to capture tracing for your application through its integration with [OpenTelemetry](https://opentelemetry.io/). OpenTelemetry is a vendor-neutral open-source observability freamework and has become an industry-standard.

To enable tracing you need to provide the OpenTelemetry java agent to the application's JVM options. You can read more about the OpenTelemetry java agent [here](https://github.com/open-telemetry/opentelemetry-java-instrumentation).
In short, the java agent dynamically injects bytecode to capture telemetry from a number of popular libraries and frameworks. Genesis takes advantage of this along with its own manual instrumentation.

## What's instrumented

The following is currently instrumented:

- Inbound messages over HTTP and WebSockets
- Inter-process messaging
- JDBC operations (if using a SQL database)

## Span attributes

Each span contains a number of attributes. For instance, an HTTP request span will have attributes detailing status code, http method etc. The following Genesis-specific attributes are added to the inbound message spans:

- Message Type
- Source Ref
- Username (if present)
- Payload

### Example

The below shows example values for the Genesis-specific attributes listed previously. Screenshots of traces in Zipkin can be seen at the bottom of the page.


| Attribute            | Value                                                          |
|----------------------|----------------------------------------------------------------|
| genesis.message_type | EVENT_TRADE_INSERT                                             |
| genesis.source_ref   | 6045bdfffe1177d3-00005df4-00000004-1f1e5fe74723987e-c672dc68:1 |
| genesis.username     | JohnDoe                                                        |
| genesis.payload      | {"MESSAGE_TYPE":"EVENT_TRADE_INSERT","USER_NAME":"JohnDoe","SESSION_AUTH_TOKEN":"********","REFRESH_AUTH_TOKEN":null,"VALIDATE":false,"IGNORE_WARNINGS":true,"DETAILS":{"INSTRUMENT_ID":"VOD","COUNTERPARTY_ID":"GENESIS","QUANTITY":10,"PRICE":1.5,"SIDE":"BUY"},"SOURCE_REF":"1"}                                                          |

## Set-up

The OpenTelemetry agent jar is bundled with the Genesis platform in the `lib` folder so, minimally, you need to specify the path to it in the "JVM_OPTIONS" system definition property, like so:

```kotlin
item(
  name = "JVM_OPTIONS",
  value = "-javaagent:${env["GENESIS_HOME"]}/genesis/lib/opentelemetry-javaagent.jar"
)
```

The OpenTelemetry java agent is highly configurable. You can find more information about how to configure it [here](https://opentelemetry.io/docs/instrumentation/java/automatic/agent-config/).

There are defaults for where the OpenTelemetry java agent exports the data to, see [here](https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk-extensions/autoconfigure/README.md#exporters) for more details.

By default, the `otel.service.name` property is set to the Genesis process name.

### Example

As a simple example, if you wanted to export traces to [Zipkin](https://zipkin.io/) then you could specify the following "JVM_OPTIONS":

```kotlin
item(
  name = "JVM_OPTIONS",
  value = "-javaagent:${env["GENESIS_HOME"]}/genesis/lib/opentelemetry-javaagent.jar -Dotel.traces.exporter=zipkin"
)
```
## Example screenshots

Below are a few screenshots of traces captured in a test Genesis application, viewed in Zipkin:

HTTP Login event:

![](/img/tracing-zipkin-login.png)

WebSocket Req Rep message:

![](/img/tracing-zipkin-req-instrument.png)

HTTP Insert event:

![](/img/tracing-zipkin-event-insert.png)
