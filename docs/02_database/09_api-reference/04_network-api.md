---
title: 'API Reference - Network API'
sidebar_label: 'Network API'
id: network-api
keywords: [database, api, reference, network]
tags:
    - database
    - api
    - reference
    - network
---


Use these APIs to send and receive messages between micro-services.

## ClientConnectionsManager[​](/database/api-reference/network-api/#clientconnectionsmanagerdirect-link-to-heading)

Use `@Inject` to create `ClientConnectionsManager`.

See the example below:

```kotlin
class TestService(@Inject val clientConnectionManager: ClientConnectionsManager) {}
```

## GenesisMessageClient[​](/database/api-reference/network-api/#genesismessageclientdirect-link-to-heading)

`GenesisMessageClient` is a messaging client that can be obtained using `ClientConnectionManager`. Here is an example:

If you connect successfully to the POSITION_APP_EVENT_HANDLER service, you will get GenesisMessageClient. Otherwise, you will get null.

```kotlin
class TestAuthManagerService(@Inject val clientConnectionManager: ClientConnectionsManager) {
    private val genesisMessageClient = clientConnectionManager.getGenesisMessageClient("POSITION_APP_EVENT_HANDLER")    
    // custom code here
}
```

### Constructor[​](/database/api-reference/network-api/#constructordirect-link-to-heading)

GenesisMessageClient(address: String, port: Int, secure: Boolean, configuration: NetworkConfiguration)

### Functions[​](/database/api-reference/network-api/#functionsdirect-link-to-heading)

| Name | Signature |
| --- | --- |
| addConnectionEventHandler | `fun addConnectionEventHandler(handler: ConnectionEventHandler)` |
| removeConnectionEventHandler | `fun removeConnectionEventHandler(handler: ConnectionEventHandler)` |
| request | `fun <I : Inbound, O : Outbound> request(messageWorkflow: DataWorkflow<I, O>, timeout: Int = configuration.reqRepTimeout,): Single<O>` |
| request | `suspend fun <I : Any, O : Any> request(messageWorkflow: RequestReplyDataWorkflow<I, O>,timeout: Int = configuration.reqRepTimeout,): Reply<O>` |
| request | `fun <I : Inbound, O : Outbound> request(message: I, output: Class<O>, timeout: Int = configuration.reqRepTimeout,): Single<O>` |
| request | `suspend inline fun <reified O : Outbound> request(message: Inbound, messageType: String, timeout: Int = configuration.reqRepTimeout,): O` |
| requestParametric | `suspend inline fun <reified O, reified P : Any> requestParametric(message: Inbound, messageType: String, timeout: Int = configuration.reqRepTimeout,):` |
| sendMessage | `fun sendMessage(set: GenesisSet): Boolean` |
| sendMessage | `fun sendMessage(set: GenesisMessage): Boolean` |
| sendMessages | `fun sendMessages(sets: List<GenesisSet>)` |
| sendReqRep | `fun sendReqRep(set: GenesisSet, consumer: Consumer<GenesisSet>)` |
| sendReqRep | `fun sendReqRep(set: GenesisSet, consumer: Consumer<GenesisSet>, reqRepTimeout: Int,)` |
| sendReqRep | `fun sendReqRep(set: GenesisSet): ListenableFuture<GenesisSet>` |
| sendReqRep | `fun sendReqRep(set: GenesisSet, reqRepTimeout: Int,): ListenableFuture<GenesisSet>` |
| shutdown | `@Throws(InterruptedException::class) fun shutdown()` |
| suspendRequest | `suspend inline fun <reified I : Inbound, reified O : Outbound> suspendRequest(message: I, timeout: Int = configuration.reqRepTimeout,): O?` |
| suspendRequest | `suspend inline fun <reified I : Inbound, reified O : Outbound> suspendRequest(messageWorkflow: DataWorkflow<I, O>, timeout: Int = configuration.reqRepTimeout,): O?` |

### Properties[​](/database/api-reference/network-api/#propertiesdirect-link-to-heading)

| Name | Summary |
| --- | --- |
| handler | Gives GenesisMessageHandler, which allows us to attach listeners to servers and clients |
| isActive | Checks whether netty connector is open for new connection |
| isConnected | Checks whether netty connector is open for new connection |

Example:

```kotlin
class TestAuthManagerService(@Inject val clientConnectionManager: ClientConnectionsManager) {  
    private val genesisMessageClient = clientConnectionManager.getGenesisMessageClient("GENESIS_AUTH_MANAGER")    
    fun sendMessageToEventHandler() {        
        genesisMessageClient?.waitForConnection()        
        genesisMessageClient?.sendReqRep(            
            genesisSet {                
                MESSAGE_TYPE with "EVENT_LOGIN_AUTH"                
                SERVICE_NAME with "GENESIS_AUTH_MANAGER"                
                SOURCE_REF with "sourceRef"                
                DETAILS with genesisSet {                    
                    USER_NAME with "User"                    
                    PASSWORD with "Password"                
                }            
            }        
        )?.get()        
        genesisMessageClient?.shutdown()    
    }
}
```

## GenesisMessageHandler[​](/database/api-reference/network-api/#genesismessagehandlerdirect-link-to-heading)

GenesisMessageHandler enables you to attach listeners to servers and clients.

### Functions[​](/database/api-reference/network-api/#functionsdirect-link-to-heading-1)

| Name | Signature |
| --- | --- |
| addListener | `fun addListener(listener: GenesisMessageListener<V>)` |
| removeListener | `fun removeListener(listener: GenesisMessageListener<V>)` |

## GenesisMessageListener[​](/database/api-reference/network-api/#genesismessagelistenerdirect-link-to-heading)

`GenesisMessageListener` is a functional interface with method `onNewMessage`, which listens for any new messages. `@FunctionalInterface public interface GenesisMessageListener<V extends GenesisMessage>`

### onNewMessage[​](/database/api-reference/network-api/#onnewmessagedirect-link-to-heading)

This method is called when a new message is received.

Example:

```kotlin
class CreateListener(@Inject val clientConnectionManager: ClientConnectionsManager) {    
    private val genesisMessageClient = clientConnectionManager.getGenesisMessageClient("GENESIS_AUTH_MANAGER")    
    fun listener(args: Array<String>) {        
        // Add listener which prints GenesisSet        
        genesisMessageClient?.handler?.addListener { 
            set: GenesisSet?, channel: GenesisChannel? -> println(set)        
        }        
        // Listener gets called when new message is received        
        genesisMessageClient?.sendMessage(genesisSet {            
            MESSAGE_TYPE with "EVENT_LOGIN_AUTH"            
            SERVICE_NAME with "GENESIS_AUTH_MANAGER"            
            SOURCE_REF with "sourceRef"            
            DETAILS with genesisSet {                
                USER_NAME with "User"                
                PASSWORD with "Password"            
            }        
        })    
    }
}
```
