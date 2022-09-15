---
title: 'Examples'
sidebar_label: 'Examples'
id: examples
---

[Introduction](/server/integration/apache-camel/introduction/)  | [Basics](/server/integration/apache-camel/basics) | [Advanced](/server/integration/apache-camel/advanced) | [Examples](/server/integration/apache-camel/examples) | [Configuring runtime](/server/integration/apache-camel/configuring-runtime) | [Testing](/server/integration/apache-camel/testing)

## Reading from an SFTP server

The example below defines an [SFTP component](https://camel.apache.org/components/3.16.x/sftp-component.html), and shows how you can use properties set in the _application-name_**-camel.kts**, allowing you to have site-specific variables for each instance.

This is particularly useful when integrating with external services where connection details are likely to vary between environments.

```kotlin
camel {
    routeHandler {
        val bbgEndPointPath = systemDefinition.getItem("BBG_SERVER_SFTP")
        val bbgUserName = systemDefinition.getItem("BBG_SERVER_USERNAME")
        val bbgPassword = systemDefinition.getItem("BBG_SERVER_PASSWORD")
        val bbgFileName = systemDefinition.getItem("BBG_SERVER_FILENAME")
        val pathStr = "${GenesisPaths.genesisHome()}/runtime/inbound"
        val bbgConsumerRepo = "${pathStr}/IDEMPOTENT_CONSUMER.DATA"

        from("sftp:${bbgEndPointPath}?username=${bbgUserName}&password=${bbgPassword}&include=$${bbgFileName}" +
            "&delay=1000&sortBy=file:modified&delete=false&bridgeErrorHandler=true" +
            "&knownHostsFile=/home/priss/.ssh/known_hosts&throwExceptionOnConnectFailed=true&stepwise=false")
            .idempotentConsumer(header("CamelFileName"),
                FileIdempotentRepository.fileIdempotentRepository(File(bbgConsumerRepo), 300000, 15000000))
            .process { exchange ->
                LOG.debug("SFTP copy CamelFileName = ${exchange.`in`.getHeader("CamelFileNameOnly").toString()}")
            }
            .log("BBG file transfer: \${headers.CamelFileName}")
            .to("file:${pathStr}/bbg")
    }
}
```

## Writing to an SFTP server

We can easily invert the above example and instead write files from a local directory to a remote SFTP server.
While the paths and properties below would need to be replaced with appropriate values (be they hardcoded or derived from system definition items) the example below shows how simple the basic routing can be:

```kotlin
camel {
    routeHandler {
        from("file:/directory/to/watch")
        .to("sftp://remote-host:22/remote-path?username=user&password=pass")
    }
}
```

For further details and configuration options see, the Apache Camel [SFTP component](https://camel.apache.org/components/3.16.x/sftp-component.html) documentation.
