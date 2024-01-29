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

The Genesis Platform Abstraction Language (GPAL) is a set of custom Kotlin script definitions that enable you to quickly stand up Genesis services at speed. The scripts also provide a consistent functionality set with the same look and feel throughout.

The most notable characteristics of GPAL are:
* "Intellisense" provides automatic discovery of syntax, code completion, error checking and more
* Context-aware properties and default imports facilitate quick definitions
* Self-describing code with documentation samples
* Reusable common code blocks in multiple GPAL definitions
* Tiered architecture conjoined with code generation system (e.g. sysdef to fields, fields to tables, tables to views, etc)
* Dependency injection is available - so custom code can be used to enhance available functionality
* Plugin-based architecture enables additional syntax for specific GPAL definitions (i.e. FIX Xlator plugin for streamer/streamerclient)
* GPAL Script definitions are debuggable and therefore provide additional troubleshooting capabilities when compared to other dynamic configuration languages
* Overriding capabilities at different levels for more flexibility; for example, field nullability can be defined within the GPAL fields definition, but also overridden at the GPAL tables definition level

## GPAL Default imports

The following imports are automatically available inside all GPAL definitions:

```kotlin
    global.genesis.gen.config.tables.*"
    global.genesis.gen.config.view.*"
    global.genesis.gen.dao.enums.*"
    global.genesis.gen.view.entity.*"
    global.genesis.gen.dao.*"
    global.genesis.commons.model.GenesisSet
    global.genesis.commons.model.GenesisSet.genesisSet   
    org.joda.time.DateTime
    org.joda.time.DateTime.now
    global.genesis.config.dsl.ScriptModules
    gpal.extn.shared.*
    global.genesis.message.core.common.*
```

Some imports are context-aware and will change depending on the application you are building and the GPAL definition you are using. For example, GPAL files can automatically add imports for any classes defined under
`global.genesis.$productName.message.common.*` and `global.genesis.$productName.message.$messageType.*` where `$productName` is the name of the application you are building and `$messageType` matches different GPAL definitions (such as request for request servers, event for eventhandlers, etc.).

Some GPAL definitions also have additional default imports to complement their functionality. For example, GPAL Event handlers have the additional imports available in scope:

```kotlin
        kotlinx.coroutines.async
        kotlinx.coroutines.flow.*
        kotlinx.coroutines.rx3.await
        global.genesis.message.core.event.EventReply
        global.genesis.db.DbRecord.Companion.dbRecord
        global.genesis.db.EntityModifyDetails
        global.genesis.eventhandlertDatabaseWrapper
        global.genesis.eventhandler.pal.state.*
```

### GPAL example

Here is a simple example for the GPAL process configuration definition:

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

In this example it is possible to identify a few of the characteristics described in this introductory page:

* Java/Kotlin classes can be imported to bring additional functionality, as shown by the TimeUnit import.
* We can override system definition values at the process level, which in turn are defined in the GPAL System definition file. Thanks to the code-like nature of the GPAL definitions, the same syntax and underlying implementation can be reused to provide the override capabilities.
* GPAL table configurations are available by default (e.g. TRADE, INSTRUMENT, ALT_INSTRUMENT_ID, MARKET, EXCHANGE, CURRENCY). Furthermore, if one of these tables is removed from the GPAL table definition, this process configuration file becomes incorrect, as it references a non-existent table, and it will automatically validate this issue as a compilation error.
* Simple syntax that can be easily understood in an English-like language.
