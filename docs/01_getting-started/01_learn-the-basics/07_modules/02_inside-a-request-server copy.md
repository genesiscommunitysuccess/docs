---
title: 'Inside a Request Server'
sidebar_label: 'Inside a Request Server'
id: inside-a-request-server
---


A Request Server supplies static data to the front end of your application.

Request Servers, (otherwise known as request/replies and often shortened to reqrep) retrieve a snapshot of data from a table or a view on demand and serve it up to the requesting client. Typically, this is data requested by the front end.

When the request is received, the Request Server replies with a single response. Once the response is received, the transaction has been completed.

You specify all your Request Servers as requestReply queries in a single Kotlin script file. If your application is called bravo, then this file will be called **bravo-reqrep.kts**. Each requestReply query is designed to supply all or some data from the specified table or view.


Here is a simple example of a Request Server file. It defines three requestReply queries:

- the first returns all the fields in the INSTRUMENT_DETAILS table
- the second returns all the fields in the EXCHANGE table
- the third includes a  request block, which specifies the two fields ALTERNATE_TYPE and INSTRUMENT_CODE as a primary key; it responds with four fields from the INSTRUMENT_DETAILS table

```kotlin
requestReplies {
    requestReply(COUNTERPARTY)

    requestReply(EXCHANGE)

    requestReply(INSTRUMENT_DETAILS) {
        request {
            ALTERNATE_TYPE
            INSTRUMENT_CODE withAlias "ALTERNATE_CODE"
        }

        reply {
            INSTRUMENT_CODE
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
        }
    }
}
```
Your application will certainly have many more queries, but that covers the basics. Generally speaking, if you create your tables and views carefully, you can keep your **dataserver.kts** simple.



