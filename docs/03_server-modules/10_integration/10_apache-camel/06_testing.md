---
title: 'Testing'
sidebar_label: 'Testing'
id: testing
---

[Introduction](/server-modules/integration/apache-camel/introduction/)  | [Basics](/server-modules/integration/apache-camel/basics) | [Advanced](/server-modules/integration/apache-camel/advanced) | [Examples](/server-modules/integration/apache-camel/examples) | [Configuring runtime](/server-modules/integration/apache-camel/configuring-runtime) | [Testing](/server-modules/integration/apache-camel/testing)

To create integration tests for your Apache Camel routes, you need to create service tests by extending the `AbstractGenesisTestSupport` class and specifying the relevant **-camel.kts** file as the Script File Name.

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