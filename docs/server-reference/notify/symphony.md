---
title: 'Symphony'
sidebar_label: 'Symphony'
sidebar_position: 3
id: symphony
---

[Symphony](http://symphony.com) is a secure instant messaging service focused on financial companies. 
To make Symphony services available to Genesis, including the sending and receiving of messages, 
you need to provision [symphony service](https://symphony.com/participate) and configure a [symphony bot](https://docs.developers.symphony.com/developer-tools/developer-tools/bdk-2.0).

#### System Definition configuration

The following configuration details are an example of Genesis Symphony Connection details. Genesis requires the use of Symphony POD, Symphony Bot and the generation of private/public key pairs. 
This is covered extensively in Symphony Documentation.      

```kotlin
// Symphony Config
item(name = "SYMPHONY_SESSION_AUTH_HOST", value = "76680.p.symphony.com")
item(name = "SYMPHONY_SESSION_AUTH_PORT", value = 443)
item(name = "SYMPHONY_KEY_AUTH_HOST", value = "76680.p.symphony.com")
item(name = "SYMPHONY_KEY_AUTH_PORT", value = 443)
item(name = "SYMPHONY_POD_HOST", value = "76680.p.symphony.com")
item(name = "SYMPHONY_POD_PORT", value = 443)
item(name = "SYMPHONY_AGENT_HOST", value = "76680.p.symphony.com")
item(name = "SYMPHONY_AGENT_PORT", value = 443)
item(name = "SYMPHONY_BOT_USERNAME", value = "botusergenesis@genesis.global")
item(name = "SYMPHONY_BOT_EMAIL_ADDRESS", value = "botusergenesis@genesis.global")
item(name = "SYMPHONY_BOT_PRIVATE_KEY_PATH", value = "/home/priss/run/site-specific/cfg/symphony/rsa/")
item(name = "SYMPHONY_BOT_PRIVATE_KEY_NAME", value = "76680.p.symphonybotkey.pem")
```

In addition to this, where a Symphony Gateway has been configured for handling incoming messages, where those incoming messages have an attachment,
those attachments will be dropped on the server to the following configured directory parameter `DOCUMENT_STORE_BASEDIR` e.g.:

```kotlin
item(name = "DOCUMENT_STORE_BASEDIR", value = "/home/trading/run/site-specific/incoming-docs")
```

Also, incoming messages that are configured to publish to a topic will set the DOCUMENT_ID for that attachment eventual file location on the server.

#### Database configuration


##### GATEWAY

| Field Name | Usage |
| --- | --- |
| GATEWAY_ID | A Unique name for the gateway which can be referenced in the NOTIFY_ROUTE table  |
| GATEWAY_TYPE | For Symphony connection this might be SymphonyRoom, SymphonyByUserEmail, SymphonyRoomReqRep|
| GATEWAY_VALUE | This is room name specified as Symphony Conversation Id Or [Stream Id](https://docs.developers.symphony.com/building-bots-on-symphony/datafeed/overview-of-streams).|
| INCOMING_TOPIC | When the GATEWAY_TYPE specified as SymphonyRoom then Incoming messages are directed to this TOPIC. <br />  When the GATEWAY_TYPE is specified as SymphonyRoomReqRep then it's treated as colon separated string specifying the PROCESS_NAME:EVENT_HANDLER_NAME, such that incoming messages will be directed to the name Event Handler running in the named process |

##### NOTIFY
| Field Name | Usage |
| --- | --- |
| SENDER | Genesis User sending message, if Symphony OBO is activated then this message will be sent 'On Behalf Of' of this user |
| TOPIC | The Topic to broadcast this message |
| HEADER | Header that appended to beginning of every message |
| NOTIFY_SEVERITY |  An ENUM of either, "Information", "Warning", "Serious", "Critical", which defaults to "Information". This is simply appended to a Symphony Message Header.
| BODY | Message as Symphony [MessageML](https://docs.developers.symphony.com/building-bots-on-symphony/messages/overview-of-messageml/message-format-messageml) Format |
| NOTIFY_COMPRESSION_TYPE | Do not set, used internally by Genesis, indicates if the body of the message is compressed and by which compression type |
| DOCUMENT_ID | If set, this should refer to a server side path and filename. This file will be attached to the outgoing message that are destined for a symphony gateway

#### Additional Genesis Notify Service for symphony

The Genesis Notify Service currently provides additional Symphony operation exposed as event handlers.

* GATEWAY_CREATE_CHANNEL - Adds a user to a channel
* GATEWAY_ADD_MEMBER_TO_CHANNEL - Adds a user to a channel
* GATEWAY_REMOVE_MEMBER_FROM_CHANNEL - removes a use from a channel

```kotlin
package global.genesis.message.core.event.notify
data class CreateChannel(val topic: String, val channelName: String)
data class AddUserToChannel(val channelName: String, val userId: String)
data class RemoveUserFromChannel(val channelName: String, val userId: String)
```

## Configuring Symphony On-Behalf-Of (OBO) for outgoing messages 

To utilise the Symphony OBO feature, 
which enables messages to be sent through a configured symphony robot as a particular user, you need to configure your application to point to the 
required symphony extension app. Documentation on how to set this up in Symphony is covered [here](https://docs.developers.symphony.com/building-extension-applications-on-symphony/app-authentication/obo-authentication)

```kotlin
item(name = "SYMPHONY_APP_ID", value = "GENESIS_EXTENSION_APP")
```