---
title: 'Request Server - examples'
sidebar_label: 'Examples'
id: examples
keywords: [server, request server, examples]
tags:
  - server
  - request server
  - examples
---

You define your application's Request Server in a kotlin script file called _application-name_**-reqrep.kts**. 

Below is an example of a **reqrep.kts** file where the single `requestReply` code block includes a `where` clause. You can find out more about using `where` clauses on the [Basics](../../../server/request-server/basics/#where-block) page.

```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE
        }

        where { row, parameters ->
             row.instrumentCode == "ALLL3" &&                         
             parameters.getString("ALTERNATE_TYPE") in listOf("RIC", "BLOOMBERG") 
        }
    }
}
```

Below is a **reqrep** file with a fairly simple `requestReply` codeblock that has standard `request` and `reply` statements. The [`where` block](../../../server/request-server/basics/#where-block) filters out any data that does not meet the conditions. All data that is returned will have an instrumentCode equal to the request parameter INSTRUMENT_CODE. 

```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            INSTRUMENT_CODE
        }

        reply {
            INSTRUMENT_CODE
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }

        where { row, parameters ->
            row.instrumentCode.equals(parameters.getString("INSTRUMENT_CODE"))
        }
    }
}
```

In the example below, we have modified the example above to include two restrictions:

- The maximum number of rows to be returned is 5.
- The process will time out if no response is received for 15 seconds.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {

        rowReturnLimit = 5
        timeout = 15

        request {
            ALTERNATE_TYPE withAlias "ALTERNATE_TYPE"
        }

        reply {
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }
    }
}
```
