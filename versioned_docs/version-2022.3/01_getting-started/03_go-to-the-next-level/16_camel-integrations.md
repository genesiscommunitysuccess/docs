---
title: 'Go to the next level - Camel integrations'
sidebar_label: 'Camel integrations'
id: camel
keywords: [getting started, quick start, next level, apache camel, integration]
tags:
    - getting started
    - quick start
    - next level
    - apache camel
    - integration
---

The Genesis low-code platform supports the use of [Apache Camel](https://camel.apache.org/) in order to integrate with external systems, using its plethora of [components](https://camel.apache.org/components/3.16.x/index.html).

Genesis makes this easy to configure and set up, allowing new processors to be defined and used within GPAL.

Should you wish to ingest data from a file or database, it is worth first checking out [Genesis Data Pipelines](/server/integration/data-pipeline/introduction/), which offers a higher-level ingestion workflow than the Apache Camel DSL.

## Section objectives
The goal of this section is to:
- define and configure a Netty REST API via Camel
- package dependencies into our application distribution

## Configure Netty API in Camel

To work with the Camel GPAL, we must first add the dependency `genesis-pal-camel` to your **position-app-tutorial-script-config** module. This ensures that you are able to use the camel functionality within your scripts. Ensure that Gradle imports the new dependency.

```kotlin
api("global.genesis:genesis-pal-camel")
```

Now we can create a new file **positions-app-tutorial-camel.kts** with the following:

```kotlin
camel {
    routeHandler {
        from("netty-http:http://0.0.0.0:8080/foo")
            .transform()
            .constant("Hello World")
    }
}
```

In the above script, we define an Apache Camel route using the netty-http component. This opens a resource on localhost:8080/foo. Finally, we return the "Hello World" string to the caller.

## Configure the runtime dependencies

For this to work, we must ensure that we have `camel-netty-http` on the classpath at runtime. To do this, we create a new module in the project called **positions-app-tutorial-camel-libs** and configure the **build.gradle.kts** within this new module to include the Camel dependency:

```kotlin
dependencies {
    api("org.apache.camel:camel-netty-http")
}

description = "positions-app-tutorial-camel-libs"
```

We then need to bring this new module into the project's **settings.gradle.kts** by appending the following:

```kotlin
include("positions-app-tutorial-camel-libs")
```

And finally include the new module as a dependency on the **positions-app-tutorial-distributions** module by adding it to the **build.gradle.kts** within this module.

```kotlin
implementation(project(":positions-app-tutorial-camel-libs"))
```

We should now have the Camel dependencies on the classpath at runtime. Next, we need to configure the runtime itself.

## Configure the runtime

Ensure that you add the following config to your **-processes.xml** and **-service-definitions.xml** files:

```xml
<process name="POSITIONS_APP_TUTORIAL_CAMEL">
    <groupId>POSITIONS_APP_TUTORIAL</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
    <module>genesis-pal-camel</module>
    <package>global.genesis.camel.pal</package>
    <script>positions-app-tutorial-camel.kts</script>
    <description>Camel integrations</description>
    <classpath>positions-app-tutorial-camel-libs*.jar</classpath>
    <language>pal</language>
    <loggingLevel>TRACE,DATADUMP_ON</loggingLevel>
</process>
```

```xml
<service host="localhost" name="POSITIONS_APP_TUTORIAL_CAMEL" port="11007"/>
```

We are now ready to deploy the changes. Run `assemble` and then `deploy-genesisproduct-positions-app-tutorial`.

To test that our Camel route is correctly running, try running a CURL on the API we have started

```bash
curl http://localhost:8080/foo
```

You should now see "Hello World" returned.

There are a countless number of choices when it comes to [Camel components](https://camel.apache.org/components/3.16.x/index.html). Take a look at the list to see if there is something that works with your own use cases.
