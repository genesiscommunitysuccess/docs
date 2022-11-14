---
title: 'Notify - Genesis Screen'
sidebar_label: 'Genesis Screen'
id: genesis-screen
keywords: [server, integration, notify, microsoft teams]
tags:
- server
- integration
- notify
- genesis screen
---

Genesis provides a mechanism for creating pop up toast notifications on screen in app. Any notifications sent to the Genesis Screen will be sent as toast pop up notification either on a company-wide or profile basis.

## System configuration

The application will require a simple .ts file to process the alert. Any new ALERTS will be addressed to users stipulated in the USER_PROFILE table.

## Database configuration

### GATEWAY

You'll need to set up a GATEWAY entry for each of the channels the app needs to send messages to.

| Field Name | Usage                                                                                                                                                                       |
| --- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GATEWAY_ID | A unique identifier for this gateway, which will be referenced in the NOTIFY_ROUTE table when sending a message to the channel: for example, the Channel name could be used |
| GATEWAY_TYPE | Should be set to `GenesisScreen`                                                                                                                                            |
| GATEWAY_VALUE | This should be set to the PROFILE that contains the list of users that you would like the pop up notificatins to go to.                                                     |
| INCOMING_TOPIC | N/A - Notify does not currently support inbound messages from the channel                                                                                                   |
| CONNECTION_ID | N/A                                                                                                                                                                         |

Here is an example GATEWAY entry:

```
==================================
GATEWAY
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-03-16 13:35:18.863(n:0,s:1964)      NANO_TIMESTAMP
CONNECTION_ID                                                                     STRING
GATEWAY_ID                               GenesisScreen1                           STRING
GATEWAY_TYPE                             GenesisScreen                            ENUM[Log EmailUser EmailDistribution SymphonyByUserEmail SymphonyRoom MsTeamsChannel SymphonyRoomReqRep GenesisScreen]
GATEWAY_VALUE                            PROFILE1                                 STRING
INCOMING_TOPIC                                                                    STRING
-------------------------------------------------------------------------------------------
```

### NOTIFY_ROUTE

You need at least one NOTIFY_ROUTE entry set up to point to the GATEWAY record, so that NOTIFY records are routed as messages.

| Field Name | Usage                                                                                                                                                                                                                                                   |
| --- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ENTITY_ID | N/A                                                                                                                                                                                                                                                     |
| ENTITY_ID_TYPE | `GATEWAY` `PROFILE_NAME` `USER_NAME`                                                                                                                                                                                                                                    |
| GATEWAY_ID | Should match GATEWAY_ID in the corresponding GATEWAY record                                                                                                                                                                                             |
| NOTIFY_ROUTE_ID | This will be auto generated if left blank, else be sure to give it a unique value with respect to other records                                                                                                                                         |
| TOPIC_MATCH | This can be anything, NOTIFY records will target this via the TOPIC field, and messages will be routed to all gateways with a matching TOPIC_MATCH value. In a simple/typical setup we make it match the GATEWAY_ID in the corresponding GATEWAY record |

Here is an example NOTIFY_ROUTE entry:

```
==================================
NOTIFY_ROUTE
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-10-26 15:38:52.152(n:0,s:3711)      NANO_TIMESTAMP
ENTITY_ID                                                                         STRING
ENTITY_ID_TYPE                           GATEWAY                                  ENUM[USER_NAME PROFILE_NAME GATEWAY]
GATEWAY_ID                               GenesisScreen1                           STRING
NOTIFY_ROUTE_ID                          000000000000202NRLO1                     STRING
TOPIC_MATCH                              TOPIC1                                   STRING
-------------------------------------------------------------------------------------------
TIMESTAMP                                2022-10-26 15:38:52.162(n:0,s:3712)      NANO_TIMESTAMP
ENTITY_ID                                PROFILE1                                 STRING
ENTITY_ID_TYPE                           PROFILE_NAME                             ENUM[USER_NAME PROFILE_NAME GATEWAY]
GATEWAY_ID                               GenesisScreen1                           STRING
NOTIFY_ROUTE_ID                          000000000000203NRLO1                     STRING
TOPIC_MATCH                              TOPIC2                                   STRING
```

### NOTIFY

Writing a record to this table which correctly points to a TOPIC, will result in a popup toast being sent to the list of users the GATEWAY record is pointed to.

Equally, EVENT_NOTIFY_INSERT can be used, as opposed to a direct table write (and is the encouraged form of interaction), this event allows for the same set of fields as the DbRecord. The input fields detailed below cater for either approach.

| Field Name | Usage                                                                          |
| --- |--------------------------------------------------------------------------------|
| APPLICATION_REF | N/A                                                                            |
| BODY | The body of the message, this can be in json format to help display on screen. |
| DOCUMENT_ID | N/A                                                                            |
| EXPIRY | N/A                                                                            |
| HEADER | N/A                                                                            |
| NOTIFY_COMPRESSION_TYPE | N/A                                                                            |
| NOTIFY_ID | Autogenerated Unique value                                                     |
| NOTIFY_SEVERITY | N/A                                                                            |
| SENDER | N/A                                                                            |
| TOPIC | The TOPIC_MATCH value on the NOTIFY_ROUTE record you wish to target            |

Here is an example of using NOTIFY:

```
==================================
NOTIFY
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-11-02 19:26:27.061(n:0,s:1015)      NANO_TIMESTAMP
APPLICATION_REF                                                                   STRING
BODY                                     {"MESSAGE":"A trade quantity has been... STRING
DOCUMENT_ID                                                                       STRING
EXPIRY                                                                            DATETIME
HEADER                                   quantity over 10                         STRING
NOTIFY_COMPRESSION_TYPE                                                           STRING
NOTIFY_ID                                000000000001301NTLO1                     STRING
NOTIFY_SEVERITY                          Information                              ENUM[Information Warning Serious Critical]
SENDER                                                                            STRING
TOPIC                                    TOPIC1                                   STRING
-------------------------------------------------------------------------------------------
```

This example results in a toast popup message, such as:

![](/img/notify-genesis-screen-example.png)
