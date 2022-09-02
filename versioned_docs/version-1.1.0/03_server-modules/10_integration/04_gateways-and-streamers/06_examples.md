---
title: 'Examples'
sidebar_label: 'Examples'
id: examples
---
Streamer example:

```kotlin
streams {
    stream("ORDERS_OUT", ORDERS_OUT.BY_TIMESTAMP) {
        batchSize = 2
        where { ordersOut, logonMessage ->
            ordersOut.quanity > 1_000 && logonMessage.getString("KEY") == "SECRET"
        }
        fields {
            ORDERS_OUT.CLIENT_ID
            ORDERS_OUT.QUANTITY withPrefix "ORDER"
            ORDERS_OUT.CLIENT_ID withAlias "CLIENT"
        }
    }
}
```
Streamer Client example:

```kotlin
streamerClients {
    streamerClient(clientName = "QUOTE_RESPONSE") {
        dataSource(processName = "TRADING_APP-STREAMER", sourceName = "ORDERS_OUT")
        onMessage {
            send("QUOTE_EVENT_HANDLER", "QUOTE_UPDATE_EVENT")
        }
    }

    streamerClient("FILTERED", QUOTES.SYMBOL) {
        dataSource("PROC_A", "QUOTES_STREAM")

        onMessage("VODL") {
            sendFormatted("QUOTE_ENGINE", "VODL_EVENT") {
                QUOTES.SYMBOL
                QUOTES.SECURITY_EXCHANGE withAlias "EXCHANGE"
                "UPDATE" withHeader "VERSION"
                QUOTES.PRICE withAlias "BID_PRICE"
            }
        }

        onMessage("MSFT") {
            sendFormatted("QUOTE_ENGINE", "MSFT_EVENT") {
                QUOTES.SYMBOL
                QUOTES.SECURITY_EXCHANGE withAlias "EXCHANGE"
                "UPDATE" withHeader "VERSION"
                "WINDOWS" withHeader "OS"
                QUOTES.PRICE withAlias "BID_PRICE"
            }
        }
    }
}
```