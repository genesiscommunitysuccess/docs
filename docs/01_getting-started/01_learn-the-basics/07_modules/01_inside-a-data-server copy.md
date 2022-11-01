---
title: 'Modules - Inside a Data Server'
sidebar_label: 'Inside a Data Server'
id: inside-a-data-server
keywords: [getting started, basics, modules, data server]
tags:
    - getting started
    - basics
    - modules
    - data server
---

A Data Server supplies real-time (streaming) data to the front end of your application.

Data Servers monitor specific tables or views in the database. When a change in data occurs, the Data Server sends the changed data to all users who have subscribed to the table or view.

The first time the user subscribes, all the data for the table or view is sent. The connection between the user and the Data Server remains open; so from then on, the Data Server automatically sends changes.

You specify all your Data Servers as queries in a single Kotlin script file. If your application is called bravo, then this file will be called **bravo-dataserver.kts**. Each query is designed to supply all or some data from the specified table or view.

You can define any number of queries. A query can be on an individual table or view. All the details of the table or view are inherited from the definition, so you don’t need to supply any further details.

Here is a simple example of a Data Server file. It defines two queries:

- the first contains all the fields in the COUNTERPARTY table
- the second contains five fields - a subset of the INSTRUMENT_DETAILS table

```kotlin
dataServer {
    query(COUNTERPARTY)

    query(INSTRUMENT_DETAILS) {
        fields {
            INSTRUMENT_CODE
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
        }
    }
}
```
Your application will certainly have many more queries, but that covers the basics. Generally speaking, if you create your tables and views carefully, you can keep your **dataserver.kts** simple.


