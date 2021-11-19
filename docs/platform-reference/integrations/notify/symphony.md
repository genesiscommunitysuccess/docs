---
title: 'Symphony'
sidebar_label: 'Symphony'
sidebar_position: 3
id: symphony
---

[Symphony](http://symphony.com) is a secure instant messaging service focused on financial companies. 
To make Symphony services available to Genesis, including the sending and receiving of messages, you need to provision [symphony service](https://symphony.com/participate) and configure a [symphony bot](https://docs.developers.symphony.com/developer-tools/developer-tools/bdk-2.0).

### Symphony Configuration

The following configuration details are an example of Genesis Symphony connection details. Genesis requires the use of Symphony POD, Symphony Bot and the generation of private/public key pairs. 
This is covered extensively in the Symphony Documentation.  

filename: ```notify.kts```

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

Where you have configured a Symphony Gateway for handling incoming messages, any attachments to incoming messages will be dropped on the server to the following configured directory parameter `DOCUMENT_STORE_BASEDIR` . For example:

```kotlin
item(name = "DOCUMENT_STORE_BASEDIR", value = "/home/trading/run/site-specific/incoming-docs")
```

Also, if the incoming message is configured to publish to a topic, the filename of any attachment will be sent to the DOCUMENT_ID field for the topic (showing its file location on the server). In the event of clashing file names, the incoming attachment's file name will have the suffix _1, _2 added, as appropriate.

### Database configuration


#### GATEWAY

| Field Name | Usage |
| --- | --- |
| GATEWAY_ID | A Unique name for the gateway which can be referenced in the NOTIFY_ROUTE table  |
| GATEWAY_TYPE | For Symphony connection this might be SymphonyRoom, SymphonyByUserEmail, SymphonyRoomReqRep|
| GATEWAY_VALUE | This is the room name specified as Symphony Conversation Id Or [Stream Id](https://docs.developers.symphony.com/building-bots-on-symphony/datafeed/overview-of-streams).|
| INCOMING_TOPIC | When the GATEWAY_TYPE is specified as SymphonyRoom, then Incoming messages are directed to this TOPIC. <br />  When the GATEWAY_TYPE is specified as SymphonyRoomReqRep then it's treated as colon-separated string specifying the PROCESS_NAME:EVENT_HANDLER_NAME, such that incoming messages will be directed to the named Event Handler running in the named process |
| CONNECTION_ID | This should reference the connection `id` specified in the ```notify.kts``` file. Note if not id is specified in the connection, then you should use the default id of `Symphony`

#### NOTIFY
| Field Name | Usage |
| --- | --- |
| SENDER | Genesis User sending message, if Symphony OBO is activated then this message will be sent 'On Behalf Of' of this user |
| TOPIC | The Topic to broadcast this message |
| HEADER | Header that appended to beginning of every message |
| NOTIFY_SEVERITY |  An ENUM of either, "Information", "Warning", "Serious", "Critical", which defaults to "Information". This is simply appended to a Symphony Message Header.
| BODY | Message as Symphony [MessageML](https://docs.developers.symphony.com/building-bots-on-symphony/messages/overview-of-messageml/message-format-messageml) Format |
| NOTIFY_COMPRESSION_TYPE | Do not set. This is used internally by Genesis, indicates if the body of the message is compressed and by which compression type |
| DOCUMENT_ID | If set, this should refer to a server-side path and filename. This file will be attached to the outgoing message that is destined for a symphony gateway

### Additional Genesis Notify service for symphony

The Genesis Notify service currently provides additional Symphony operations, exposed as event handlers.

* GATEWAY_CREATE_CHANNEL creates a channel
* GATEWAY_ADD_MEMBER_TO_CHANNEL adds a user to a channel
* GATEWAY_REMOVE_MEMBER_FROM_CHANNEL removes a user from a channel

- note: where there is more than one symphony connection defined, these operations act upon the first listed.

```kotlin
package global.genesis.message.core.event.notify
data class CreateChannel(val topic: String, val channelName: String)
data class AddUserToChannel(val channelName: String, val userId: String)
data class RemoveUserFromChannel(val channelName: String, val userId: String)
```

## Configuring Symphony On-Behalf-Of (OBO) for outgoing messages 

To use the Symphony OBO feature, which enables messages to be sent through a configured symphony robot as a particular user, you need to configure your application to point to the required symphony extension app. 

Documentation on how to set this up in Symphony is covered [here](https://docs.developers.symphony.com/building-extension-applications-on-symphony/app-authentication/obo-authentication)

```kotlin
item(name = "SYMPHONY_APP_ID", value = "GENESIS_EXTENSION_APP")
```