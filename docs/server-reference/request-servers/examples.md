---
title: Examples
sidebar_label: Examples
sidebar_position: 2
id: examples
---

## Simple reqrep
```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS)
}
```

## Multiple reqreps
```kotlin
requestReplies {
    requestReply(COUNTERPARTY)

    requestReply(INSTRUMENT_DETAILS)
}
```

## Specific fields on request and reply
```kotlin
requestReplies {
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
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }
    }
}
```

## Where clause
```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS_WHERE", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE
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

        where { instrumentDetails, _ ->
            "ALLL3" == instrumentDetails.instrumentCode
        }
    }
}
```

## Pre-processing of the request
```kotlin
requestReplies {
    requestReply("WITH_DEFAULT_TRANSFORMATION_VALUE", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE withTransformation { type, _ ->
                type?.toUpperCase() ?: "RIC"
            }
            INSTRUMENT_CODE withAlias "ALTERNATE_CODE"
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
    }
}
```

## Row return limit
```kotlin
requestReplies {
    requestReply("QUICK_INSTRUMENT", INSTRUMENT_DETAILS) {

        rowReturnLimit = 2

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

## Simple custom reqrep
```kotlin
requestReplies {
    requestReply<Instrument.ById, Instrument> {
        timeout = 10

        replySingle { index ->
            db.get(index)
        }
    }
}
```

## More complex custom reqrep
```kotlin
requestReplies {
    requestReply<AltInstrumentId.ByAlternateTypeAlternateCode, AltInstrumentId> {

        reply { byAlternateTypeAlternateCode ->
            when {
                byAlternateTypeAlternateCode.alternateType == "*" ->
                    db.getBulk(ALT_INSTRUMENT_ID)

                byAlternateTypeAlternateCode.alternateCode == "*" ->
                    db.getRange(byAlternateTypeAlternateCode, 1)

                else -> db.get(byAlternateTypeAlternateCode).flow()
            }
        }
    }
}
```