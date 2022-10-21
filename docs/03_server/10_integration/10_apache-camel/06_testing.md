---
title: 'Apache Camel - Testing'
sidebar_label: 'Testing'
id: testing
keywords: [server, integration, apache camel, testing]
tags:
  - server
  - integration
  - apache camel
  - testing
---

[Introduction](/server/integration/apache-camel/introduction/)  | [Basics](/server/integration/apache-camel/basics) | [Advanced](/server/integration/apache-camel/advanced) | [Examples](/server/integration/apache-camel/examples) | [Configuring runtime](/server/integration/apache-camel/configuring-runtime) | [Testing](/server/integration/apache-camel/testing)

To create integration tests for your Apache Camel routes, you need to create service tests by extending the `AbstractGenesisTestSupport` class and specifying the relevant _application-name_**-camel.kts** file as the `scriptFileName`.

Examples of how you would initialise a test extending this class are provided below.

```kotlin
class GenesisCamelTest : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        addPackageName("global.genesis.eventhandler")
        addPackageName("global.genesis.camel.pal")
        genesisHome = "/genesisHome"
        parser = { it }
        scriptFileName = "test-camel.kts"
    }
)
```