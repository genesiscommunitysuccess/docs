<!-- Below is a **reqrep.kts** file that has a fairly simple `requestReply` codeblock with standard `request` and `reply` statements. The [`filterWithParameters` block](/develop/server-capabilities/query-data/snapshot-queries-request-server/#filterwithparameters) filters out any data that does not meet the conditions. All data that is returned will have an instrumentCode equal to the request parameter INSTRUMENT_CODE. -->

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

        filterWithParameters {
            data.instrumentCode == genesisSet.getString("INSTRUMENT_CODE")
        }
    }
}
```