---
title: 'Notify - Symphony'
sidebar_label: 'Symphony'
id: symphony
keywords: [server, integration, notify, symphony]
tags:
  - server
  - integration
  - notify
  - symphony
---

[Symphony](http://symphony.com) is a secure instant messaging service focused on financial companies. 
To make Symphony services available to Genesis, including the sending and receiving of messages, you need to provision [symphony service](https://symphony.com/participate) and configure a [symphony bot](https://docs.developers.symphony.com/developer-tools/developer-tools/bdk-2.0).

## Symphony configuration

Genesis requires the use of Symphony POD, Symphony Bot and the generation of private/public key pairs. This is covered extensively in the Symphony [documentation](https://docs.developers.symphony.com/building-bots-on-symphony/overview-of-rest-api/pod-api).  

Symphony must be configured in your **notify.kts** file. Here is an example configuration with connection details. 



```kotlin
notify {

    // note: the connection 'id' will default to 'Symphony' if it's not specified, however if you have multiple connections
    //       of the same type (in this case symphony) then it will need to be specified. 
    symphony(id = "symphony1") {

        sessionAuthHost = "76680.p.symphony.com"
        botUsername = "botusergenesis@genesis.global"
        botPrivateKeyPath = "/home/priss/run/site-specific/cfg/symphony/rsa/"
        botPrivateKeyName = "bot1.test.pem"
        appId = "GENESIS_EXTENSION_APP"  // optional, required for Symphony OBO feature
    }
    
    // optionally include additional connections, including additional Symphony, Email or Microsoft Teams connections 
}

```

Now consider another example. For this, the private key is sourced from the DB. 

To store the private key in a DB, you need to use the `SYSTEM` table with `SYSTEM_VALUE` set to the contents of the private key and the associated `SYSTEM_KEY` set to `SymphonyRsaKey`.

```kotlin
notify {

    symphony(id = "symphony1") {

        sessionAuthHost = "76680.p.symphony.com"
        botUsername = "botusergenesis@genesis.global"
        botPrivateKeyFromDb = true
    }
    
}

```

## Using system definition in the notify.kts script
You must configure Notify in your application's **genesis-system-definition.kts** file.

```kotlin
systemDefinition {
    global {
        
            item(name = "SESSION_AUTH_HOST", value = "76680.p.symphony.com" )
            item(name = "BOT_USER_NAME", value = "botusergenesis@genesis.global" )         
        }
}
```

Once that is configured, you can refer to the item name directly in your **notify.kts** script, without import or qualifier.


```Kotlin
notify {

    symphony(id = "symphony1") {

        sessionAuthHost = SESSION_AUTH_HOST
        botUsername = BOT_USER_NAME
        botPrivateKeyFromDb = true
    }
    
}
```

Where you have configured a Symphony Gateway for handling incoming messages, any attachments to incoming messages will be dropped on the server to the following configured directory parameter: `DOCUMENT_STORE_BASEDIR`. 

For example:

```kotlin
item(name = "DOCUMENT_STORE_BASEDIR", value = "/home/trading/run/site-specific/incoming-docs")
```

If the incoming message is configured to publish to a topic, the file name of any attachment will be sent to the `DOCUMENT_ID` field for the topic (showing its file location on the server). In the event of clashing file names, the incoming attachment's file name will have the suffix _1, _2 added, as appropriate.

## Database configuration


### GATEWAY

| Field Name | Usage |
| --- | --- |
| GATEWAY_ID | A unique name for the gateway, which can be referenced in the `NOTIFY_ROUTE` table  |
| GATEWAY_TYPE | For Symphony connection this might be SymphonyRoom, SymphonyByUserEmail, SymphonyRoomReqRep|
| GATEWAY_VALUE | This is the room name specified as Symphony Conversation Id Or [Stream Id](https://docs.developers.symphony.com/building-bots-on-symphony/datafeed/overview-of-streams)|
| INCOMING_TOPIC | When the `GATEWAY_TYPE` is specified as SymphonyRoom, then incoming messages are directed to this `TOPIC`. <br />  When the `GATEWAY_TYPE` is specified as SymphonyRoomReqRep then it's treated as colon-separated string specifying the `PROCESS_NAME:EVENT_HANDLER_NAME`, such that incoming messages will be directed to the named Event Handler running in the named process |
| CONNECTION_ID | This should reference the connection `id` specified in the ```notify.kts``` file. Note if no id is specified in the connection, then you should use the default id of `Symphony`

### NOTIFY

| Field Name | Usage |
| --- | --- |
| SENDER | Genesis User sending message, if Symphony OBO is activated then this message will be sent 'On Behalf Of' of this user |
| TOPIC | The Topic to broadcast this message |
| HEADER | Header that appended to beginning of every message |
| NOTIFY_SEVERITY |  An ENUM of either, "Information", "Warning", "Serious", "Critical", which defaults to "Information". This is simply appended to a Symphony Message Header
| BODY | Message as Symphony [MessageML](https://docs.developers.symphony.com/building-bots-on-symphony/messages/overview-of-messageml/message-format-messageml) Format |
| NOTIFY_COMPRESSION_TYPE | Do not set. This is used internally by Genesis; it indicates if the body of the message is compressed and by which compression type |
| DOCUMENT_ID | If set, this should refer to a server-side path and file name. This file will be attached to the outgoing message that is destined for a Symphony gateway

## Genesis Notify operations for Symphony

The Notify service currently provides additional Symphony operations; these are exposed as Event Handlers.

* `GATEWAY_CREATE_CHANNEL` creates a channel (to allow external users to be added to a channel; a channel should be created with `external` set to `true` and `public` to `false`)
* `GATEWAY_ADD_MEMBER_TO_CHANNEL` adds a user to a channel (if the user is not a member of the host POD, then a connection request will be sent to that user)
* `GATEWAY_REMOVE_MEMBER_FROM_CHANNEL` removes a user from a channel
* `GATEWAY_ACTION_ON_CHANNEL` allows a channel to be either reactivated or deactivated

Where there is more than one Symphony connection defined, these operations act upon the first listed.

```kotlin
package global.genesis.message.core.event.notify
data class CreateChannel(
    val topic: String,
    val channelName: String,
    val external: Boolean = false,
    val multilateral: Boolean = false,
    val discoverable: Boolean = true,
    val public: Boolean = true
)
data class AddUserToChannel(val channelName: String, val userId: String)
data class RemoveUserFromChannel(val channelName: String, val userId: String)
data class ActionOnChannel(val roomId: String, val activate: Boolean)
```
The Notify service also offers the following Request Server resource `LIST_MEMBERS_OF_CHANNEL`, which, unsurprisingly, lists members of a channel.

* Inputs (Request)

    `ChannelName` - Symphony Stream Id

* Outputs (Response)

    `USER_EMAIL`

    `USER_ID`  - Symphony User Id

## Configuring OBO for outgoing messages 

To use the Symphony On-behalf-of (OBO) feature, which enables messages to be sent through a configured Symphony robot as a particular user, you need to configure your application to point to the required Symphony extension app. 

You can find out how set this up in the [Symphony Documentation](https://docs.developers.symphony.com/building-extension-applications-on-symphony/app-authentication/obo-authentication)

```kotlin
item(name = "SYMPHONY_APP_ID", value = "GENESIS_EXTENSION_APP")
```