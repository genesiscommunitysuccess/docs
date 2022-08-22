---
id: 05_ssdt-day5
title: Day 5
sidebar_label: Day 5
sidebar_position: 6

---
This day covers:

- [Camel module​](#camel-module)
- [Data pipeline](#data-pipeline)


## Camel module

The Genesis Platform supports the use of [Apache Camel](https://camel.apache.org/) in order to integrate with external systems, using its plethora of [components](https://camel.apache.org/components/3.16.x/index.html). Genesis makes this easy to configure and set up, allowing new processors to be defined and used within GPAL.

Likely uses for Apache Camel include:
- receiving data from the local filesystem
- receiving data from an external location
- sending data to an external location

:::info
Note that Camel's power and flexibility comes at the cost of some complexity and configuration overhead. If you simply want to ingest and transform data from the most common sources (e.g. CSV files and certain relational databases), you should first investigate the new [Genesis Data Pipeline](/server-modules/integration/data-pipeline/introduction/), which offers a higher-level ingestion workflow than the Apache Camel DSL.
:::

Apache Camel integrations are defined within your application's **-camel.kts** file. This is located in the **src/main/resources/scripts** directory within your application's **-script-config** submodule.

### Camel configuration

Here is a simple example of a** *-camel.kts** file. It defines a single route using a range of Camel configuration options, which we'll explore in a little more detail below:
```kotlin
camel {
    routeHandler {
        val pathStr = "${GenesisPaths.genesisHome()}/runtime/inbound/"
        from("file:${pathStr}/exampledir/?move=.camel/\${date:now:yyyyMMdd-HHmmssSSS}-\${headers.CamelFileName}&initialDelay=5000&readLock=changed&readLockCheckInterval=5000&readLockTimeout=60000")
            .process(fileEventProcessorProvider.createProcessor("EXAMPLE_EVENT_HANDLER", "EVENT_FILE_IMPORT_EXAMPLE", "FILE", "SOURCE_NAME"))
    }
}
```

The `routeHandler` defines the possible routes for information to flow into and out of our system.  The example above defines one route. First, it defines the `pathStr` using the `GenesisPaths` class to find the `GENESIS_HOME` system environment variable. Next, it defines the route itself. The route in the example comes from the filesystem determined by the `file:` specifier at the start of the string. This could be any [Apache Camel component](https://camel.apache.org/components/3.16.x/index.html) that can act as a [consumer](https://camel.apache.org/manual/camelcontext.html#_consumer). Further `routeHandler` parameters and explanation can be found [here](/server-modules/integration/apache-camel/basics/#routehandler).


#### Exercise 5.1 Reading and Writing using a SFTP server
<!--
http://localhost:8080/server-modules/integration/apache-camel/examples/#reading-from-an-sftp-server
https://www.sftp.net/public-online-sftp-servers
-->
:::info ESTIMATED TIME
?? mins
:::

???.

:::tip
:::



## Data pipeline

https://docs.genesis.global/secure/creating-applications/defining-your-application/integrations/data-pipeline/overview/