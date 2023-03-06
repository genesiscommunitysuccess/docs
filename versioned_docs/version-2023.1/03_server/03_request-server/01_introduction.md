---
title: 'Request Server - introduction'
sidebar_label: 'Request Server'
id: introduction
keywords: [server, request server, introduction]
tags:
  - server
  - request server
  - introduction
---




Request Servers, (otherwise known as request/replies and often shortened to reqrep) retrieve a snapshot of data from a table or a view on demand and serve it up to the requesting client. They are predominantly used for serving the UI.

Request Servers will reply with a single response. Once the response is received, the transaction is over (unlike a [Data Server](../../../server/data-server/basics), which stays connected to the client and pushes updates).

```mermaid
graph TD
A[UI] --> |Connection| B(REQUEST_SERVER)
B -->|Set Response| A
B -->|Request| C[Database]
C --> |Response|B
```
## Introduction
Request Servers have other features distinct from a Data Server, such as allowing one-to-many joins, and even completely custom request servers for serving up non-linear data (e.g. sets of disjointed data to serve up to a report).

```kotlin
  requestReply("TRADE", TRADE_VIEW) {
    permissioning {
      permissionCodes = listOf("TRADER", "SUPPORT")
      auth(mapName = "ENTITY_VISIBILITY") {
        TRADE_VIEW.COUNTERPARTY_ID
      }
    }
  }
```

Request Servers are conventionally configured in the file _application-name_**-reqrep.kts**. This file should be in the _application-name_-script-config module.

So, if your application is called **positions**, the file would be named **positions-reqrep.kts**.

You should also check the Request Server component in your application's system-processes and service-definition files, as described in the [Configuring runtime](../../../server/request-server/configuring-runtime) page.

:::info
The following examples in this section assume you have the following fields and tables present:

```kotlin
    field(name = "INSTRUMENT_ID", type = STRING)
    field(name = "INSTRUMENT_CODE", type = STRING)
    field(name = "INSTRUMENT_NAME", type = STRING)
    field(name = "VWAP", type = STRING)
    field(name = "LAST_TRADED_PRICE", type = DOUBLE)
    field(name = "TRADED_CURRENCY", type = STRING)
    field(name = "EXCHANGE_ID", type = STRING)
    field(name = "SPREAD", type = DOUBLE)
    field(name = "ALTERNATE_TYPE", type = STRING)
```

```kotlin
    table (name = "INSTRUMENT_DETAILS", id = 11005) {
        INSTRUMENT_CODE
        INSTRUMENT_ID
        INSTRUMENT_NAME
        LAST_TRADED_PRICE
        VWAP
        SPREAD
        TRADED_CURRENCY
        EXCHANGE_ID
        ALTERNATE_TYPE
        primaryKey {
            INSTRUMENT_ID
        }
    }
```
:::
