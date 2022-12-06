---
title: 'GPAL - introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, GPAL, introduction]
tags:
  - server
  - GPAL
  - introduction
---

Genesis Platform Abstraction Language (GPAL) is our own scripting language, which plugs into IntelliJ. 

GPAL gives you access to lots of functions. 
Some functions are generic (available to all modules) other functions are specific to a module.

Once you define an object in GPAL (such as a View), you can use it in multiple components.

## Kotlin functions libraries

![](/img/kotlin-functions-edit.png)

Camel
Purge
Notify
Consolidator
Data Pipeline
Data Server
Event Handler
ReqRep
Streamer
Streamer Client
Router
Sys Def
Fields
Tables
Process Config
View

## Kotlin function examples

The following imports are automatically available inside GPAL Event Handlers:

```kotlin
import CodeBlock from '@theme/CodeBlock';
import Imports from '!!raw-loader!/examples/server/java/event-handlers/imports.java';

<CodeBlock className="language-java">{Imports}</CodeBlock>
```

```kotlin
val systemDefinition: SystemDefinitionService
val rxDb: RxDb
val entityDb: AsyncEntityDb
val metaData: MetaDataRegistry
val evaluatorPool: EvaluatorPool
val messageDelegator: MessageDelegator
val networkConfiguration: NetworkConfiguration
val serviceDetailProvider: ServiceDetailProvider
val genesisHFT: GenesisHFT
val injector: Injector
val clientConnectionsManager: ClientConnectionsManager
val typedEventManager: TypedEventManager
```

### GPAL example
```kotlin
    import java.util.concurrent.TimeUnit
    
    process {
    
        systemDefinition {
            item(name = "DbHost", value = "localhost")
            item(name = "ClusterPort", value = "5678")
        }
    
        cacheConfig {
            expireAfterAccess(1, TimeUnit.DAYS)
            expireAfterWrite(1, TimeUnit.DAYS)
    
            initialCapacity = 20_000
            maximumEntries = 30_000
            multipleKeys = true
    
            tables {
                table(TRADE, loadOnStart = true)
                table(INSTRUMENT, loadOnStart = true)
                table(ALT_INSTRUMENT_ID, loadOnStart = true)
                table(MARKET, loadOnStart = true)
                table(EXCHANGE, loadOnStart = true)
                table(CURRENCY, loadOnStart = true)
            }
        }
    }
```

As the example above shows, the GPAL **process-config** file can override system definition values on a per-module basis as well.

Further information about how it works can be found at [type safe builders](https://kotlinlang.org/docs/type-safe-builders.html).

Further information about functions can be found at [kotlin function scope](https://kotlinlang.org/docs/functions.html#function-scope).