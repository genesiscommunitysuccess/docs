---
id: network-api
title: Network API
sidebar_label: Network API
sidebar_position: 51
---

Use these APIs to send/receive messages to micro-services

### ClientConnectionsManager

Use @Inject to create ClientConnectionsManager. See the examplae below:

```kotlin
class TestService(@Inject val clientConnectionManager: ClientConnectionsManager) {

}
```

### GenesisMessageClient
GenesisMessageClient is messaging client and can be obtained by using ClientConnectionManager like below example. 
You will get GenesisMessageClient if successfully connected to TRADING_APP_EVENT_HANDLER service or null

```kotlin
class TestAuthManagerService(@Inject val clientConnectionManager: ClientConnectionsManager) {

    private val genesisMessageClient = clientConnectionManager.getGenesisMessageClient("GENESIS_AUTH_MANAGER")

    // custom code here
}
```

#### Constructor

GenesisMessageClient(address: String, port: Int, secure: Boolean, configuration: NetworkConfiguration)

#### Functions

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
| sendReqRep | ` fun sendReqRep(set: GenesisSet, reqRepTimeout: Int,): ListenableFuture<GenesisSet>` |
| shutdown | `@Throws(InterruptedException::class) fun shutdown()` |
| suspendRequest | `suspend inline fun <reified I : Inbound, reified O : Outbound> suspendRequest(message: I, timeout: Int = configuration.reqRepTimeout,): O?` |
| suspendRequest | `suspend inline fun <reified I : Inbound, reified O : Outbound> suspendRequest(messageWorkflow: DataWorkflow<I, O>, timeout: Int = configuration.reqRepTimeout,): O?` |

#### Properties

| Name | Summary |
|---|---|
| handler | Gives GenesisMessageHandler, which allows us to attach listeners to servers and clients |
| isActive | Checks whether netty connector is open for new connection |
| isConnected | Checks whether netty connector is open for new connection |

### Example

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

### GenesisMessageHandler

GenesisMessageHandler allows you to attach listeners to servers and clients

#### Functions

| Name | Signature |
| --- | --- |
| addListener | `fun addListener(listener: GenesisMessageListener<V>)` |
| removeListener | `fun removeListener(listener: GenesisMessageListener<V>)` |

### GenesisMessageListener

GenesisMessageListener is functional interface with method `onNewMessage` which listens for any new messages
`@FunctionalInterface
public interface GenesisMessageListener<V extends GenesisMessage>`

#### onNewMessage

This method is called when new message is received

Example:

```kotlin
class CreateListener(@Inject val clientConnectionManager: ClientConnectionsManager) {

    private val genesisMessageClient = clientConnectionManager.getGenesisMessageClient("GENESIS_AUTH_MANAGER")

    fun listener(args: Array<String>) {
        // Add listener which prints GenesisSet
        genesisMessageClient?.handler?.addListener { set: GenesisSet?, channel: GenesisChannel? ->
            println(set)
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
        }
        )
    }

}
```