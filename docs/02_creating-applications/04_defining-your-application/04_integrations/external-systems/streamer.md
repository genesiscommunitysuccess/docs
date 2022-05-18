---
title: Streamer
sidebar_label: Streamer
sidebar_position: 3
id: streamer
---

This page shows you how to create a Streamer.

You can see an example of a Streamer in practice in our [tutorial](/tutorials/building-an-application/fix-gateway/).

## Creating a Streamer
To create a Streamer:

1. Add the process configuration for the Streamer to the _applicationName_**-processes.xml** file. For example:

```xml
<process name="TRADING_APP_STREAMER">
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-streamer</module>
    <package>global.genesis.streamer.pal</package>
    <script>trading_app-streamer.kts</script>
	<language>pal</language>
</process>
```

For more information on the above process tags, see the page on [configuring runtime processes](/creating-applications/configure-runtime/processes-xml).

2. Create a kotlin script file named {applicationName}-streamer.kts. Add the following information:
    * A stream name 
    * A GPAL index reference for a unique index with a single LONG field, this could refer to a table index or a view index.

The simplest Streamer definition is:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP)  
}
```

This example creates a stream called `ORDER_OUT`, based on the `ORDERS_OUT` table (or view). The data will be streamed, ordered by timestamp.

### Parameters
You can also specify the following optional parameters in a stream block:

`batchSize` - default value 100

`logoffTimeout` - default value 5000

`maxLogons` - default value 1

### Transforming the stream
You can define the following blocks to transform the stream:
* where
* fields
* toGenesisSet

**Where**

Using where, the stream can be filtered. It is available in two versions: one that just has the streamed row as a parameter, and one that also has the logon message.

Here, we only stream orders with a quantity greater than 1,000.
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        where { ordersOut ->
            ordersOut.quantity > 1_000
        }
    }
}
```

In this example, we only stream orders with a quantity greater than 1,000 and where the logon message has provided a secret key.
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        where { ordersOut, logonMessage ->
            ordersOut.quanity > 1_000 && logonMessage.getString("KEY") == "SECRET"
        }
    }
}
```

**Fields**
The fields tag enables you to transform the output in a similar way to views, data server and req rep definitions. For example, here we output three fields:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        fields {
            ORDERS_OUT.CLIENT_ID
            ORDERS_OUT.QUANTITY withPrefix "ORDER"
            ORDERS_OUT.CLIENT_ID withAlias "CLIENT"
        }
    }
}
```

**toGenesisSet**
This enables you to create a custom GenesisSet from the entity:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        toGenesisSet { ordersOut ->
            genesisSet {
                "ORDER_QUANTITY" with ordersOut.quantity
                "ORDER" with ordersOut.orderId
            }
        }
    }
}
```
