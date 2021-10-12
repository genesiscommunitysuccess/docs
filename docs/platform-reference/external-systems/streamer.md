---
title: Streamer
sidebar_label: Streamer
sidebar_position: 3
id: streamer
---

### Create streamer
To create a streamer the following are required:

1. Add streamer process configuration in {applicationName}-processes.xml file

Ex:
```xml
<process name="TRADING_APP-STREAMER">
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-streamer</module>
    <package>global.genesis.streamer</package>
    <script>trading_app-streamer.kts</script>
</process>
```

2. Create kotlin script file named {applicationName}-streamer.kts and add following
    * A stream name 
    * An GPAL index reference for a unique index with a single LONG field, this could refer to a table index or a view index.

The simplest streamer definition is:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP)  
}
```

This will create a stream called “ORDER_OUT”, based on the ORDERS_OUT table (or view), and the data will be streamed ordered by timestamp.

The following settings are also available as optional parameters you can specify in stream block

`batchSize` - default value 100

`logoffTimeout` - default value 5000

`maxLogons` - default value 1

Also, the following blocks are available to transform the stream:
* where
* fields
* toGenesisSet

**Where**

Using where, the stream can be filtered. It is available in two versions. One that just has the streamed row as a parameter and one that also has the logon message.

Here we only stream orders with a quantity greater than 1,000.
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        where { ordersOut ->
            ordersOut.quantity > 1_000
        }
    }
}
```

Here we only stream orders with a quantity greater than 1,000 and where the logon message provided a secret key.
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
The fields tag allows the output to be transformed in a similar way to views, data server and req rep definitions. For example, here we output three fields:
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
This allows you to create a custom GenesisSet from the entity
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
