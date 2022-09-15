---
title: 'Apache Camel - Advanced'
sidebar_label: 'Advanced'
id: advanced
keywords: [apache camel]
tags:
    - apache camel
---

[Introduction](/server-modules/integration/apache-camel/introduction/)  | [Basics](/server-modules/integration/apache-camel/basics) | [Advanced](/server-modules/integration/apache-camel/advanced) | [Examples](/server-modules/integration/apache-camel/examples) | [Configuring runtime](/server-modules/integration/apache-camel/configuring-runtime) | [Testing](/server-modules/integration/apache-camel/testing)

## Automatic import

The following properties are automatically available inside a GPAL `camel { ... }` definition:

```kotlin
val systemDefinition: SystemDefinitionService
val rxDb: RxDb
val context: DefaultCamelContext
val producer: ProducerTemplate
val serviceDiscovery: ServiceDiscovery
val asyncEntityDb: AsyncEntityDb
val rxEntityDb: RxEntityDb
val injector: Injector
val LOG: Logger
```

## A more advanced example Camel configuration

Here is a more advanced example of an _application-name_**-camel.kts** file. It defines 2 routes, and has an `onCommit` block, similar to those seen in [Event Handlers](/server-modules/event-handler/basics/). This is because the `camel` block in Genesis functions acts as a type of Event Handler, reacting to `EVENT_CAMEL_SEND` message types. These events can be raised as normal with Genesis, allowing the Event Handler to be invoked from:

- other `eventHandler` codeblocks
- the front end
- custom components in the application.

The Event Handler aspect of this example allows these events to be accessed easily from the Apache Camel route builder in the [SEDA component](https://camel.apache.org/components/3.16.x/seda-component.html).

This example demonstrates use of the `LOG` and `rxEntityDb` properties noted above, while the last route demonstrates the use of the `serviceDiscovery` helper to dispatch an event to an [Event Handler](/server-modules/event-handler/basics/).

```kotlin
import global.genesis.jackson.core.GenesisJacksonMapper.Companion.csvIterator

camel {
    onCommit {
        LOG.info("Received: {}", it)
        val properties = it.details.properties
        when (val targetExtension = properties["TARGET_EXTENSION"].toString()) {
            "CSV" -> DefaultCamelSendToCSV.handle(it.details, producer)
            "XML" -> DefaultCamelSendToXml.handle(it.details, producer)
        }
        EventReply.EventAck()
    }
    routeHandler {
        from("seda:PROFILE_USER")
            .process { exchange ->
                LOG.info("seda:PROFILE_USER")
                val body = exchange.message.body.toString()
                val profileUsers = body.csvIterator(ProfileUser::class.java)
                for (profileUser in profileUsers) {
                    rxEntityDb.insert(profileUser).blockingGet()
                }
            }
        from("seda:MOVIES")
            .process { exchange ->
                LOG.info("seda:MOVIES")
                val body = exchange.message.body.toString()
                val movie = Movies {
                    id = "1"
                    name = body
                }
                rxEntityDb.insert(movie).blockingGet()
            }
        from("seda:REVIEWS")
            .process { exchange ->
                LOG.info("seda:REVIEWS")
                val review = exchange.message.body.toString()
                val set = genesisSet {
                  MESSAGE_TYPE with "PROCESS_REVIEW"
                  DETAILS with genesisSet {
                    "BODY" with review
                  }
                }
                val service = serviceDiscovery.resolveClient("REVIEW_HANDLER")
                if (service != null) {
                  service.sendMessage(set)
                } else {
                  LOG.error("Unable to discover REVIEW_HANDLER service")
                }
            }
    }
}
```

### onCommit
In the above example, the `onCommit` block reads from the properties in the received event, and uses the inbuilt `DefaultCamelSendTo*` classes to send the event message to an appropriate `seda:` endpoint. Details on the SEDA endpoint within Apache Camel can be found [here.](https://camel.apache.org/components/3.16.x/seda-component.html)

### routeHandler
In the above example, we have three defined routes. In the first two, we are receiving data from the `seda:` endpoints and then processing it, using an inline-defined processor. This can be useful for quickly defining a processor that isn't used elsewhere. Compared to the previous example, the results of the SEDA endpoint are directly persisted as entities in the database, rather than being passed on to a [Request Server](/server-modules/request-server/basics/).

The third route demonstrates the use of service discovery to locate another process assumed to be a [Genesis Event Handler](/server-modules/event-handler/basics/) to which a message is then dispatched.

Remember; if your use case is basic data ingestion, transformation and persistence to GenesisDB, then you should first investigate the [Genesis Data Pipeline](/server-modules/integration/data-pipeline/introduction/), which offers a higher-level abstraction than seen here.
