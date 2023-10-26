---
title: 'Modules - inside a Request Server'
sidebar_label: 'Inside a Request Server'
id: inside-a-request-server
keywords: [getting started, basics, modules, request server]
tags:
    - getting started
    - basics
    - modules
    - request server
---

<iframe src="https://player.vimeo.com/video/792592165?h=18cdb5adf0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>

A Request Server supplies static data to the front end of your application.

When a user at the front end requests a snapshot of data from a table or a view, the relevant `requestReply` code in the Request Server retrieves the data and sends it to the front end. Once the response is received, the transaction is complete.

Each `requestReply` query is designed to supply all or some data from the specified table or view. You must specify all the required `requestReply` queries in a single Kotlin script file. If your application is called bravo, then this file will be called **bravo-reqrep.kts**. 

Here is a simple example of a Request Server file. It defines three `requestReply` queries:

- the first returns all the fields in the COUNTERPARTY table
- the second returns all the fields in the EXCHANGE table
- the third includes a `request` block, which specifies the two fields ALTERNATE_TYPE and INSTRUMENT_CODE as a primary key; it responds with four fields from the INSTRUMENT_DETAILS table

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
Your application will certainly have many more queries, but that covers the basics. Generally speaking, if you create your tables and views carefully, you can keep your **reqrep.kts** simple.



