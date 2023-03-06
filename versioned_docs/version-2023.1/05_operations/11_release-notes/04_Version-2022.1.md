---
title: 'Release notes - Version 2022.1'
sidebar_label: 'Version 2022.1'
sidebar_position: 3
id: version-2022-1
keywords: [operations, release notes, v-2022.1]
tags:
    - operations
    - release notes
    - v-2022.1
---

This is version v2022.1 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version | 
|---------------|---------|
| server        | 6.0.0   |  
| web           | 1.0.0   |   

Release date: April 11, 2022.

# Release notes

## New Web UI components

### New packages

- foundation-store: a predictable application-level state-management solution built from the ground with best practices and performance at its core.

- foundation-events: strongly typed event emitter and component mixin, which provides event and payload type checking during development.

### Seeds

#### New seeds

- foundation-store-app-seed - an example of using foundation-store to manage the web application state, along with foundation-events. Both packages and approach will likely form the backbone of all future apps.

- hello-world-app-seed - a bare-bones seed project.

#### Improved seeds

- positions-app-seed - additional functionality added, such as server-side row model example.

### Micro front-ends

- foundation-login - improvements include customisation, auto connect, password reset, sso fixes, etc.

### Other changes

- Lazy route loading: splitting your routes into different bundles to streamline load times; unvisited routes are never downloaded to the browser. foundation-store-app-seed uses this.

- Design-system improvements: live in app customisation, token mapping improvements, better consistency between design-system versions, ie. alpha and zero (a.k.a rapid).

- More component customisation examples, currently demonstrated in foundation-store-app-seed, but will also be detailed in our docs.

- API extractor/Docs generation: available on foundation-store initially, plans to roll out across all packages in Q2.

- Changes to grid set-ups to support server-side row model use-cases.

- Date Picker component.

- Switch component.

- Nested Tabs.

- Segmented Control/Radio Button group component.

- Number field improvements.

- Slider component.

- Progress (linear and radial) component.

- Tree view component.

- Breadcrumb component.

- Icon component.

- Github Pages preview of select showcase apps and storybook.

## pal-streamer and pal-streamerclient

Both pal-streamer and pal-streamerclient modules have been reworked and numerous bugs have been fixed in terms of recoverability and replayability.

## Service registry/discovery via Consul

Genesis is working towards enabling containerised architecture for large enterprise systems.

Up until this new version, service registry/discovery implementation assumed (in general) that each Genesis node is a clone of each other. This created limitations, mostly tied to local availability of xml files with the process/service definition, and also the local memory-mapped files folder containing the resource metadata information associated with a service. The platform couldn’t easily perform operations like load-balancing messages at the router level, or set up heterogeneous servers (different service sets in each one of them), automatic failover, leader election (i.e. primaryOnly only definitions), etc.

This is not flexible enough for some of the target architectures desired by platform users; and it’s not good enough for the platform either.

[HashiCorp Consul](https://www.consul.io/) provides this functionality in a relatively easy manner, and without a huge impact on the current platform implementation. Additionally, it can run heterogeneous deployments that have a mix of external services, EC2 instances (or VMs) and K8s clusters. For this reason, we should be able to harness its capabilities with our current deployment models. Potentially, this could be used later on in a Kubernetes world.

This release provides experimental support for Hashicorp Consul to manage service registry, service discovery and service health checks (integrated with our existing process status monitor system).

### Enabling Consul support

You can enable Consul support by adding a new system definition item with the name “ClusterMode” and the value “CONSUL”.

The consul agent must be installed in the same host the service is running for this to work as expected.

### How Consul works

When Consul is enabled, Genesis services like genesis-evaluator and genesis-router will use the new service-discovery mechanism and automatic failover provisioning to find a healthy service which can serve a specific resource.

The availability of a service is defined by its own health checks, which are fully integrated with the Genesis process status monitor system.

**primaryOnly** services will also go through a leader election process managed by Consul. This replicates the original primary/standby behaviour in Genesis, and adds automated self-promotion for standby services when a **primaryOnly** service has gone down.


:::note
The following services do **not** use the new service-discovery mechanism:
- GENESIS_SYNC (host-based, not resource-based)
- genesis-streamer (current supported microservice is genesis-pal-streamer)
- genesis-streamerclient (current supported microservice is genesis-pal-streamerclient)
  :::

### Using the ServiceDiscovery API

All custom Genesis processes are able to inject “global.genesis.clustersupport.service.ServiceDiscovery” and use it to retrieve information about target resources or services.

The interface is described below.

```kotlin
interface ServiceDiscovery {
	/**
	 * Get own address. Default service discovery will provide hostname, whilst ConsulServiceDiscovery will provide the hostname IP
	 */
	fun localHost(): String
	
	/**
	 * Resolves a message client by resource name (e.g. ALL_USERS, EVENT_TRADE_INSERT, etc)
	 */
	fun resolveClientByResource(resourceName: String, initializationLogic: Consumer<GenesisMessageClient> = Consumer{}): GenesisMessageClient?
	
	/**
	 * Resolves resource information: name, type and serviceName.
	 */
	fun resolveResourceInfo(resourceName: String): ResourceInfo?
	
	/**
	 * Resolves client.
	 */
	fun resolveClient(serviceName: String, initializationLogic: Consumer<GenesisMessageClient> = Consumer{}): GenesisMessageClient?
	
	/**
	 * Resolves service.
	 */
	fun resolveService(serviceName: String, initializationLogic: Consumer<GenesisMessageClient> = Consumer{}): MessageService?
	
	/**
	 * Get all available resources.
	 */
	fun getResources(): Map<String, ResourceInfo>
	
	/**
	 * Adds listener to service changes. The listener will provide a new service list containing all healthy services every time a change happens.
	 */
	fun addServiceListener(service: String, consumer: Consumer<List<ServiceInfo>>)
}
```
The current service resolution strategy for “resolveClient” and “resolveService” methods implemented as part of **ConsulServiceDiscovery** is to return a **GenesisMessageClient** connected to a random service from those that are available. We shall look into implementing different strategies as we evolve the current implementation.

The returned **GenesisMessageClient** instances are **cached,** and users of the API **should not attempt to call the “shutdown” method on them**.

### MessageService interface

A new interface has been created to represent a resilient MessageService that can automatically failover to other services **when running under “Consul” mode**.

It uses “sticky” connections. This means it will attempt to connect to a target service and keep the connection open as long as the service is available. If the connection is closed, it will attempt to connect to another healthy service as soon as possible.

This behaviour is most desirable where you have a long-running bidirectional data stream. For example, a genesis-pal-streamerclient process will create one connection to a streamer service and initiate the recovery procedure on connection. Once the recovery procedure has finished, it will keep receiving real-time updates from the streamer. If the connection goes down, we need to reconnect to a new streamer process and initiate the recovery procedure again. The same concept applies to Data Server connections.

For now, only GenesisSet type messages are available as part of the interface, but we are looking to extend the “MessageService” capabilities to use type-safe messages as well.

```kotlin
interface MessageService {
  val defaultRequestTimeout: Int
  val address: String
	/**
	 * Boolean value will confirm if message sent was successful or not
	 */
	fun rxSendMessage(
	    set: GenesisSet,
	): Single<Boolean> = rxSendMessage(set, defaultRequestTimeout)
	
	/**
	 * Boolean value will confirm if message sent was successful or not
	 */
	fun rxSendMessage(
	    set: GenesisSet,
	    timeout: Int
	): Single<Boolean>
	
	/**
	 * Boolean value will confirm if message sent was successful or not
	 */
	@JvmSynthetic
	suspend fun suspendSendMessage(
	    set: GenesisSet,
	): Boolean = suspendSendMessage(set, defaultRequestTimeout)
	
	/**
	 * Boolean value will confirm if message sent was successful or not
	 */
	@JvmSynthetic
	suspend fun suspendSendMessage(
	    set: GenesisSet,
	    timeout: Int
	): Boolean
	
	fun rxRequest(
	    set: GenesisSet,
	): Single<GenesisSet> = rxRequest(set, defaultRequestTimeout)
	
	fun rxRequest(
	    set: GenesisSet,
	    timeout: Int,
	): Single<GenesisSet>
	
	/**
	 * Returns null if timeout, exception if error.
	 */
	@JvmSynthetic
	suspend fun suspendRequest(
	    set: GenesisSet,
	): GenesisSet? = suspendRequest(set, defaultRequestTimeout)
	
	/**
	 * Null if timeout, exception if error.
	 */
	@JvmSynthetic
	suspend fun suspendRequest(
	    set: GenesisSet,
	    timeout: Int,
	): GenesisSet?
	
	   
	/**
	 * Add listener to handler.
	 *
	 *@param listener listener to add
	 */
	fun addListener(listener: GenesisMessageListener<GenesisSet>)
	
	/**
	 * Remove listener to handler.
	 *
	 *@param listener listener to add
	 */
	fun removeListener(listener: GenesisMessageListener<GenesisSet>)
	
	/**
	 * Adds connection event handler
	 *
	 *@param listener listener to add
	 */
	fun addConnectionEventHandler(handler: ConnectionEventHandler)
	
	/**
	 * Removes connection event handler
	 *
	 *@param listener listener to add
	 */
	fun removeConnectionEventHandler(handler: ConnectionEventHandler)
	
	/**
	 * Closes message service.
	 */
	fun close()
}
```

## Changes to GenesisMessageClient

GenesisMessageClient now implements the **MessageListener** interface located in **global.genesis.net**.

## Changes to genesis-camel

All the changes in this section are [breaking changes].

genesis-camel: CSVEventHandlerProcessor, FileEventHandlerProcessor and KafkaEventHandlerProcessor are now deprecated. These won’t be using the new service discovery provided by Consul (i.e. they won’t be able to automatically discover resources living in separate environments).

To address this, new bindings have been added to the Groovy expression embedded in the xml file, called: “csvEventProcessorProvider”, “fileEventProcessorProvider” and “kafkaEventProcessorProvider”.

Each one of these bindings has a “createProcessor” method with the same constructor parameters as their corresponding previous Processor classes and will use the new service discovery mechanism.

## CLI tool for creating a new full-stack project

This release adds a new Quick Start Application seed. This creates a single project containing both front-end and back-end code.

## One-step full-stack local preview

This release adds two new Gradle tasks

- `setupEnvironment` - sets up and configures the Genesis platform. It can be executed on a local Linux host, WSL or via SSH.
- `deploy-<project-name>` - deploys the current project to a specified Genesis set-up. It can be executed on a local Linux host, WSL or via SSH.

## Reporting component (Alpha)

A new optional Reporting component is available, which enables users to create report specifications, run them, or save them for later use.

The GUI enables users to:

- select columns from existing data sources
- save the report with a name and retrieve for future use
- apply ad hoc filtering to a report
- export the report results to .csv format


## Dictionary Builder

The default for the “table id” option has changed from 0 to 2000. This prevents clashing with Genesis default tables.

`Usage: DictionaryBuilder`
`i, --tableid=<tableIdStart>
Table Id start number, defaults =**2000**`

## MSSQL

The platform now supports Microsoft SQL Server as a database layer.

To enable this usage, you need to provide a valid jdbc url pointing to an instance in the DbHost system definition property.

## GPAL Consolidators

This release contains a new iteration of the consolidator service. Consolidators perform data aggregation and calculations that can either be real-time, when used as a service, or on-demand, when used as objects.

Consolidators follow a SQL-like syntax:

```kotlin
consolidator(TRADE, ORDER) {
    select {
        ORDER {
            sum { price * quantity } into TOTAL_NOTIONAL
            count() into TRADE_COUNT
        }
    }
    groupBy { Order.ById(orderId) } 
}
```

In the above example, we aggregate data from the TRADE table into the ORDER table. We group by orderId and we count the number of trades and sum the notional. For further details, please see [here](../../03_server/07_consolidator/01_introduction.md).

The main advantages over the previous consolidator syntax are:

- Type safety
- Declarative syntax
- comprehensive built-in logging

Legacy xml consolidators are still available. However, because of the difference in syntax, it is not possible to convert from the previous xml format to the new format.

## Genesis Notify

- Improved error reporting for misconfigured `*.notify.kts` scripts.
- The default Email port is changed from 25 to 587; this is considered a better default option for modern email servers.
- **[Breaking Change]** System Definitions for  `SYSTEM_DEFAULT_USER_NAME`, have been moved to email configuration within GPAL as shown below:

```kotlin
notify {
    email {
        smtpHost = "localhost"
        smtpPort = 587
        smtpUser = "notifications@genesis.global"
        smtpPw = ""
        smtpProtocol = "SMTP_TLS"
        **systemDefaultUserName** = "Genesis System"
        **systemDefaultEmail** = "system@genesis.global"
    }
}
```

- [Breaking Change] For Symphony Connections, the configuration for storing the Private Key in the Database has been made more explicit. In the previous versions if `botPrivateKeyPath` was not specified, then there would be an attempt to load the private key from the database. You now need to state this explicitly with the use of the `botPrivateKeyFromDb` flag. This is generally easier to understand and improves error reporting when misconfigured.

```kotlin
notify {
    symphony {
        sessionAuthHost = SESSION_AUTH_HOST
        botUsername = BOT_USER_NAME
        **botPrivateKeyFromDb** = true
    }
}
```

### genesis-router configuration moved to GPAL

The genesis-router configuration has been upgraded from xml to GPAL. This will require existing xml configuration files to be rewritten in the new format, using the new type-safe implementation. Most xml tags have been replaced by similarly named properties or functions, with the exception of the `<whitelist>` tag, which has been replaced by the `allowList()` function.

**[Breaking Change]** The `config/genesis-router.xml` file is no longer supported and has been replaced by `scripts/*-router.kts`.

## Dependent modules to be released

### AUTH

#### User Management Screen

- foundation-entity-management - Basic functionality for generating CRUD based on metadata coming from the server

- Preconfigured screen of user and profile management. This is an evolution of the previous user-management, based on feedback from projects currently using user management, and to accommodate requirements from new projects.


#### auth-preferences configuration moved to GPAL

This release sees the auth-preferences configuration upgraded from xml to GPAL. This will require existing xml configuration files to be rewritten in the new format, leveraging the new type-safe implementation. In addition, the GPAL implementation of Login Acknowledgement now uses DbEntities instead of explicit tables and joins.

**[Breaking Change]** The `config/auth-preferences.xml` file is no longer supported and has been replaced by `scripts/*auth-preferences.kts`.



### FIX

The FIX gateway now has full support for QuickFIX dynamic acceptor sessions, as documented by [Quickfix](https://www.quickfixj.org/usermanual/2.3.0/usage/acceptor_dynamic.html)

In addition to the existing QuickFixMessageListener interface that can be used to add a custom handler for inbound messages, there is now a QuickFixMessagePublisher interface that can be used to read from an external source in order to send FIX messages (i.e. message queue / db external to genesis platform).

Regarding this, EVENT_SEND_RAW_FIX_MESSAGE and other message-specific events derived from data dictionaries are now only registered in the case where the gateway is using the default FixMessagePublisher implementation.

MessageStoreFactory implementations are now injectable via the same mechanism as QuickFixMessageListener and QuickFixMessagePublisher. This allows the creation of a custom FIX session recovery mechanism (i.e. message queue / db external to genesis platform).

**[Breaking Change]** Given the decoupling of message processing and db persistence, the feature and config option ‘persistAdminMessageTypes’ has been globally renamed to ‘processAdminMessageTypes’.

**[Breaking Change]** The sendMessage and sendMessageToCounterparty methods have been extracted from FixConnectionManager into a FixMessageSender class. If custom code relies on these methods, please inject an instance of FixMessageSender via dependency injection and invoke on this.

**[Breaking Change]** The lookupActiveSession, lookupActiveSessionIDs and lookupDatabaseFixSession methods have been extracted from FixConnectionManager into a FixSessionRegistry class. If custom code relies on these methods, you must inject an instance of FixSessionRegistry via dependency injection and invoke this.

**[Breaking Change]** The init method of the QuickFixMessageListener class no longer passes an instance of FixConnectionManager when it is invoked. If custom code requires this object in scope, you must pass an instance of FixConnectionManager as a constructor argument to your custom listener implementation.

**[Breaking Change]** The FIX_IN strategy that writes to the GENESIS DB FIX_IN table has now been merged with the default QuickFixMessageListener implementation. If your solution requires a custom listener and ALSO requires writes to FIX_IN, you need to construct an instance of FixInStrategy inside the custom listener.