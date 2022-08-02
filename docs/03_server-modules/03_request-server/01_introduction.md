---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---
[Introduction](/creating-applications/defining-your-application/user-interface/request-servers/request-servers/)  | [Where to define](/creating-applications/defining-your-application/user-interface/request-servers/rs-where-to-define/) | [Basics](/creating-applications/defining-your-application/user-interface/request-servers/rs-technical-details/) |  [Advanced](/creating-applications/defining-your-application/user-interface/request-servers/rs-advanced-technical-details/) | [More examples](/creating-applications/defining-your-application/user-interface/request-servers/rs-more-examples/) | [Configuring runtime](/creating-applications/defining-your-application/user-interface/request-servers/rs-configure-runtime/) | [Testing](/creating-applications/defining-your-application/user-interface/request-servers/rs-testing/)

Request Servers, (otherwise known as request/replies and often shortened to reqrep) retrieve a snapshot of data from a table or a view on demand and serve it up to the requesting client. They are predominantly used for serving the UI.

Request Servers will reply with a single response. Once the response is received, the transaction is over (unlike a [Data Server](/creating-applications/defining-your-application/user-interface/data-servers/data-servers/), which stays connected to the client and pushes updates).

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
