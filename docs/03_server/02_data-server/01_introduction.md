---
title: 'Data Server - introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, data server, dataserver, introduction]
tags:
  - server
  - data server
  - dataserver
  - introduction
---

**DO NOT USE THIS FILE**
** IT IS FOR TEST PURPOSES ONLY**

Data Servers monitor specific tables or views in the database. When a change in data occurs, the Data Server sends the updates to all its subscribers.

SINGLE POINT OF ENTRY

```mermaid
graph TD
    A[INCOMING TRADE INFORMATION] -- 6=10.02, 30=1000, 55=VOD --> B(BTIG USTP FIX Gateway)
    A -- 32=10.02, 30=1000, 55=VOD --> C(BMO GMTC FIX Gateway)
    A -- 6=10.02, 30=1000, 8015=VOD --> D(Stonex IRESS FIX Gateway)
B --> E("USTP FIX STREAMER
    mapping and normalisation")
C --> F("GMTC FIX STREAMER
    mapping and normalisation")
D --> G("IRESS FIX STREAMER 
        mapping and normalisation")   
E --> H(USTP FIX STREAMER CLIENT)
F --> I(GMTC FIX STREAMER  CLIENT)
G --> J(IRESS FIX STREAMER CLIENT) 
H --> K("TAM Trade Instruction Service
    more information here")
I --> K
J --> K
K --> L[(DATABASE)]
```
LALALAL

```mermaid
graph TD
    A[INCOMING TRADE INFORMATION] 
    B(USTP)
B --> E(USTP STREAMER)
C --> F(GMTC STREAMER)
D --> G(IRESS STREAMER)    
E --> H((DATABASE))
```


```mermaid
graph TD
A[UI] --> |Connection| B(DATA_SERVER)
B -->|Initial data| A
B --> |Updates| A
B -->|Connection| C[Database]
C --> |Changes in table/view trigger a read|B
```

NOW GET THIS

```mermaid
graph TD
A[USTP FIX Gateway] -->  B(DTCC USTP FIX Streamer)
A[GMTC FIX Gateway] -->  B(DTCC USTP FIX Streamer)
B[BTIG USTP FIX Streamer] -->  C(USTP Streamer Client)
C[USTP Streamer Client] -->  D(Trade Instruction Service)
D[Trade Instruction Service Lots more info in here]
```
LOROX

```mermaid
graph TD
A[USTP FIX Gateway] -->  B(DTCC USTP FIX Streamer)
A[GMTC FIX Gateway] 
B[BTIG USTP FIX Streamer] 
C[USTP Streamer Client] 
D[Trade Instruction Service Lots more info in here]
```

BORROCKS MERMAID

```mermaid
graph TD
A[USTP FIX Gateway] --> |Connection| B(DTCC USTP FIX Streamer)
A[GMTC FIX Gateway] --> B(GMTC FIX Streamer)
A[IRESS FIX Gateway] --> |Connection| B(Stonex IRESS FIX Streamer)
B[BTIG USTP FIX Streamer] --> |Connection| C(USTP Streamer Client)
B[GMTC FIX Streamer] --> |Connection| C(GMTC Streamer Client)
B[Stonex IRESS FIX Streamer] --> |Connection| C(IRESS Streamer Client)
C[USTP Streamer Client] --> |Connection| D(Trade Instruction Service)
C[GMTC Streamer Client] --> |Connection| D(Trade Instruction Service)
C[IRESS Streamer Client] --> |Connection| D(Trade Instruction Service)
D[Trade Instruction Service]
```

The Data Server configuration is refreshingly light, because all the hard work is done by the table or views.

A Data Server file consists of a number of queries that handle each event in the required way. You can define any number of queries. A query can be on an individual table or view. All the details of the table or view are inherited from the definition, so you don’t need to supply any further details.

## Streaming
When the front end of your application first requests data from a query in your Data Server, the query initially sends all the data in the table or view. This is typically what happens when the user logs in. This establishes a subscription between the front end and the query. Whenever a value in the underlying table or view changes, that change is automatically sent to the user. In this way, the user’s data is maintained up to date in real time, without the unnecessary burden of sending the whole data set each time there is a change. The subscription closes when the user logs out.

Data Servers are conventionally defined in the file _application-name_**-dataserver.kts**.

So, if your application is called **positions**, then the file would conventionally be named **positions-dataserver.kts**.

Note, you also need to declare your Data Server within the [runtime configuration](../../../server/data-server/configuring-runtime/).

All queries created in the Data Server are exposed as HTTP/HTTPs [REST endpoints](../../../server/integration/rest-endpoints/introduction/) automatically by the Genesis platform. You can use any http client, such as postman, to access these custom endpoints.
