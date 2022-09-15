---
title: 'Examples'
sidebar_label: 'Examples'
id: examples
---

[Introduction](/server/request-server/introduction)  | [Basics](/server/request-server/basics) | [Advanced](/server/request-server/advanced) | [Examples](/server/request-server/examples) | [Configuring runtime](/server/request-server/configuring-runtime) | [Testing](/server/request-server/testing)


Below is a fairly simple `requestReply` codeblock with standard `request` and `reply` statements. The [`where` block](/server/request-server/basics/#where-block) below filters out any data that does not meet the conditions. All data that is returned will have an instrumentCode equal to the request parameter INSTRUMENT_CODE. 

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
            ALTERNATE_TYPE
            INSTRUMENT_CODE withAlias "ALTERNATE_CODE"
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

Below is an example of a file where the single `eventHandler` code block includes a `where` clause. You can find out more about this example on the [Basics](/server/request-server/basics/#where-block) page.

```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE
        }

        where { row, parameters ->
            "ALLL3" == row.instrumentCode &&                         
             parameters.getString("ALTERNATE_TYPE") in listOf("RIC", "BLOOMBERG") 
        }
    }
}
```

