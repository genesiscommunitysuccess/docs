---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---

[Introduction](/server/integration/apache-camel/introduction/)  | [Basics](/server/integration/apache-camel/basics) | [Advanced](/server/integration/apache-camel/advanced) | [Examples](/server/integration/apache-camel/examples) | [Configuring runtime](/server/integration/apache-camel/configuring-runtime) | [Testing](/server/integration/apache-camel/testing)

Apache Camel integrations are defined within your application's **jvm/{app-name}-script-config/{app-name}-camel.kts** file.

## A simple Camel configuration

Here is a simple example. It defines a single route using a range of Camel configuration options, which we'll explore in a little more detail below:
```kotlin
camel {
    routeHandler {
        val pathStr = "${GenesisPaths.genesisHome()}/runtime/inbound/"
        from("file:${pathStr}/exampledir/?move=.camel/\${date:now:yyyyMMdd-HHmmssSSS}-\${headers.CamelFileName}&initialDelay=5000&readLock=changed&readLockCheckInterval=5000&readLockTimeout=60000")
            .process(fileEventProcessorProvider.createProcessor("EXAMPLE_EVENT_HANDLER", "EVENT_FILE_IMPORT_EXAMPLE", "FILE", "SOURCE_NAME"))
    }
}
```

### routeHandler
The `routeHandler` defines the possible routes for information to flow into and out of our system.  The example above defines one route.

- First, it defines the `pathStr` using the `GenesisPaths` class to find the `GENESIS_HOME` system environment variable.

- Next, it defines the route itself. The route in the example comes from the filesystem determined by the `file:` specifier at the start of the string. This could be any [Apache Camel component](https://camel.apache.org/components/3.16.x/index.html) that can act as a [consumer](https://camel.apache.org/manual/camelcontext.html#_consumer).

In this instance, the File component (defined in the [File component documentation](https://camel.apache.org/components/3.16.x/file-component.html)) can take several paths and query parameters, some of which we are using:

* `${pathStr}/exampledir/` is the **directoryName** mandatory path parameter. It indicates where in the file system that Apache Camel should look for files.

* `move=.camel/\${date:now:yyyyMMdd-HHmmssSSS}-\${headers.CamelFileName}` is the **move** query parameter. This determines where the files found in the path directory should be moved to once they have been processed.

* `initialDelay=5000` is the **initialDelay** query parameter. This is the time in milliseconds before the system first polls the path directory.

* `readLock=changed` is the **readLock** query parameter. This sets the strategy to ensure that the file being polled isn't in use.

* `readLockCheckInterval=5000` is the **readLockCheckInterval** query parameter. This sets the time between checks of the **readlock**.

* `readLockTimeout=60000` is the **readLockTimeout** query parameter. This sets the maximum time that Apache Camel will wait when trying to acquire a **readlock** before timing out.

:::info
Both the `$` signs are escaped (`\$`) to prevent Kotlin from injecting a variable into the string. We want these variables to be injected by Apache Camel itself rather than Kotlin.
:::

The route then processes the file using the `FileEventHandlerProcessor` created by the `createProcessor` method through the `fileEventProcessorProvider`. A similar method and class exists for handling the processing of [Kafka](https://kafka.apache.org/) messages and CSV files.

This processing will then send an **EVENT_FILE_IMPORT_EXAMPLE** message to the **EXAMPLE_EVENT_HANDLER** process, with a `dataFieldName` of **FILE**, expecting it to be handled by an appropriate `requestReply` in your [Request Server](/server/request-server/basics/).

### createProcessor
The `createProcessor` on both the `FileEventProcessorProvider` and `KafkaEventProcessorProvider` has the same parameters. However, the `createProcessor` of the `CSVEventProcessorProvider` has slightly different parameters.

The parameters for `createProcessor` on the `FileEventProcessorProvider` and `KafkaEventProcessorProvider` are:

* `processName` is the name of the process to which you are attempting to send a request to.

* `messageType` is the type of message sent to the above process. This is important for ensuring the correct `requestReply` in your [Request Server](/server/request-server/basics/) handles this request.

* `dataFieldName` is the name of the parameter that contains the data of the file or kafka events, when sent to the Request Server.

* `sourceId` is the source of this request.

* `replyCallback` is an optional parameter. It allows you to define a custom `Consumer` and behaviour on the response of the `requestReply`. By default, without setting this parameter, a consumer is constructed that logs `EVENT_NACK` messages from the `requestReply`, with the request set.

The parameters for `createProcessor` on the `CSVEventProcessorProvider` are:

* `processName` is the name of the process to which you are attempting to send a request to.

* `messageType` is the type of message sent to the above process. This is important for ensuring that the correct `requestReply`  in your [Request Server](/server/request-server/basics/) handles this request.

* `sourceId` is the source of this request.

* `separator` allows you to define which character is used as a separator.

* `ignoreHeaders` is an optional Boolean parameter, defaulting to false. If set to true, the first row of the csv will be ignored, and not parsed as part of the CSV.

* `replyCallback` is an optional parameter. It allows you to define a custom `Consumer` and behaviour on the response of the `requestReply`. By default, without setting this parameter, a consumer is constructed that logs `EVENT_NACK` messages from the `requestReply`, with the request set.

* `charset` is an optional parameter defaulting to UTF 8. This defines which character set the CSV is using.

:::info
If you want to ingest a CSV directly into GenesisDB rather than calling a Request Server, you might want to investigate the Genesis Data Pipeline [CSV source](/server/integration/data-pipeline/basics/#csv) first.
:::
