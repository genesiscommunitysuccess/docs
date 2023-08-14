<!--In the example below, we have modified the example above to include two restrictions:
- The maximum number of rows to be returned is 5.
- The process will time out if no response is received for 15 seconds. -->

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