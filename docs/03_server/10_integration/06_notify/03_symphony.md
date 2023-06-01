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
To make Symphony services available to Genesis, you need to provision [symphony service](https://symphony.com/participate) and configure a [symphony bot](https://docs.developers.symphony.com/developer-tools/developer-tools/bdk-2.0).

## Importing Symphony
Symphony is a separate module of the Genesis low-code platform. This gives platform users a better way to manage third-party dependencies, as the Symphony BDK has a number of transitive dependencies.

### Adding the Symphony module data schema
In order to add the Symphony route tables to your application, add the following in your application dictionary cache module: 

```kotlin
api("global.genesis:genesis-symphony-config")
```

### Adding the Symphony module to deployment
In order to add the Symphony distribution to your application deployment, add the following in your application deployment module: 

```kotlin
genesisServer(
    group = "global.genesis",
    name = "genesis-symphony-distribution",
    version = properties["symphonyVersion"].toString(),
    classifier = "bin",
    ext = "zip"
  )
```

### Adding the Symphony module endpoints to GENESIS_NOTIFY
In order to add the Symphony endpoints to your GENESIS_NOTIFY process, add the following package in your process definition: 
```
global.genesis.symphony.gateway.endpoints
```
and the following jar to the GENESIS_NOTIFY_PROCESS classpath
```
genesis-symphony-manager*
```

### Adding Symphony extensions for notify GPAL scripts
To configure symphony gateways, you need to import extensions for the Notify GPAL configuration. Add the following dependency to your application script-config module:

```kotlin
compileOnly("global.genesis:genesis-symphony-manager:$symphonyVersion")
```

## Symphony configuration

Genesis requires the use of Symphony POD, Symphony Bot and the generation of private/public key pairs. This is covered extensively in the Symphony [documentation](https://docs.developers.symphony.com/building-bots-on-symphony/overview-of-rest-api/pod-api).  

Symphony must be configured in your **notify.kts** file. Here is an example configuration with connection details. 



```kotlin
notify {
    gateways {
        symphony(id = "symphony1") {
            sessionAuthHost = "76680.p.symphony.com"
            botUsername = "botusergenesis@genesis.global"
            botPrivateKeyPath = "/home/priss/run/site-specific/cfg/symphony/rsa/"
            botPrivateKeyName = "bot1.test.pem"
            appId = "GENESIS_EXTENSION_APP"  // optional, required for Symphony OBO feature
        }
	}
    
    // optionally include additional connections, including additional Symphony, Email or Microsoft Teams connections 
}

```

Now consider another example. For this, the private key is sourced from the DB. 

To store the private key in a DB, you need to use the `SYSTEM` table with the following settings:

- `SYSTEM_VALUE` set to the contents of the private key, and 
- the associated `SYSTEM_KEY` set to `SymphonyRsaKey`

```kotlin
notify {
    gateways {
        symphony(id = "symphony1") {

            sessionAuthHost = "76680.p.symphony.com"
            botUsername = "botusergenesis@genesis.global"
            botPrivateKeyFromDb = true
		}
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
    gateways {
        symphony(id = "symphony1") {
            sessionAuthHost = SESSION_AUTH_HOST
            botUsername = BOT_USER_NAME
            botPrivateKeyFromDb = true
		}
    }
}
```

## Database configuration

### NOTIFY

| Field Name | Usage |
| --- | --- |
| SENDER | Genesis User sending message, if Symphony OBO is activated, then this message will be sent 'On Behalf Of' of this user |
| TOPIC | The Topic to broadcast this message |
| HEADER | Header that placed at the beginning of every message |
| NOTIFY_SEVERITY |  An ENUM of either, "Information", "Warning", "Serious", or "Critical", which defaults to "Information". This is simply appended to a Symphony Message Header
| BODY | The message content in Symphony [MessageML](https://docs.developers.symphony.com/building-bots-on-symphony/messages/overview-of-messageml/message-format-messageml) Format |

### SYMPHONY_ROOM_NOTIFY_ROUTE_EXT

| Field Name | Usage |
| --- | --- |
| ROOM_ID | The unique identifier of the Symphony chat room to send the notification to. | 
| NOTIFY_ROUTE_ID | Reference to a primary KEY in the NOTIFY_ROUTE table. |


### SYMPHONY_BY_USER_EMAIL_NOTIFY_ROUTE_EXT
| Field Name | Usage |
| --- | --- |
| ENTITY_ID | String identifying the entity to send to. |
| ENTITY_ID_TYPE | One of USER_NAME, PROFILE_NAME, ALL, or SELF. An additional value will be available that matches the ENTITY_ADMIN_PERMISSION_FIELD, if it is defined in Sysdef. | 
| NOTIFY_ROUTE_ID | Reference to a primary KEY in the NOTIFY_ROUTE table. |

## Genesis Notify operations for Symphony

The Notify service currently provides additional Symphony operations; these are exposed as [Event Handlers](../../../server/event-handler/introduction).

* `GATEWAY_CREATE_CHANNEL` creates a channel (to allow external users to be added to a channel; a channel should be created with `external` set to `true` and `public` to `false`)
* `GATEWAY_ADD_MEMBER_TO_CHANNEL` adds a user to a channel (if the user is not a member of the host POD, then a connection request will be sent to that user)
* `GATEWAY_REMOVE_MEMBER_FROM_CHANNEL` removes a user from a channel
* `GATEWAY_ACTION_ON_CHANNEL` allows a channel to be either reactivated or deactivated

Where there is more than one Symphony gateway defined, these operations act upon the first listed.

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
The Notify service also offers the [Request Server](../../../server/request-server/introduction) resource `LIST_MEMBERS_OF_CHANNEL`, which, unsurprisingly, lists members of a channel.

* Inputs (Request)

    `ChannelName` - Symphony Stream Id

* Outputs (Response)

    `USER_EMAIL`

    `USER_ID`  - Symphony User Id

## Configuring OBO for outgoing messages 

To use the Symphony On-behalf-of (OBO) feature, which enables messages to be sent through a configured Symphony robot as a particular user, you need to configure your application to point to the required Symphony extension app. 

You can find out how to set this up in the [Symphony Documentation](https://docs.developers.symphony.com/building-extension-applications-on-symphony/app-authentication/obo-authentication)

```kotlin
item(name = "SYMPHONY_APP_ID", value = "GENESIS_EXTENSION_APP")
```
