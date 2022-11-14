---
title: 'Notify - Microsoft teams'
sidebar_label: 'Microsoft teams'
id: microsoft-teams
keywords: [server, integration, notify, microsoft teams]
tags:
  - server
  - integration
  - notify
  - microsoft teams
---

Microsoft Teams provides a mechanism for exposing its channels to a remote system via webhooks. A webhook url can be created as described [here](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)

The most important thing to gather from the teams channel webhook setup is the "WebHook URL"

## System configuration

No configuration is required for Teams integration; you simply need to know the WebHook URL which is used in database entries outlined in the section below

## Database configuration

### GATEWAY

You'll need to set up a GATEWAY entry for each of the channels the app needs to send messages to.

| Field Name | Usage |
| --- | --- |
| GATEWAY_ID | A unique identifier for this gateway, which will be referenced in the NOTIFY_ROUTE table when sending a message to the channel: for example, the Channel name could be used |
| GATEWAY_TYPE | should be set to `MsTeamsChannel`|
| GATEWAY_VALUE | The teams WebHook Url from your channel (see [here](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)) |
| INCOMING_TOPIC | N/A - Notify does not currently support inbound messages from the channel |
| CONNECTION_ID | N/A |

Here is an example GATEWAY entry:

```
==================================
GATEWAY
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-03-16 13:35:18.863(n:0,s:1964)      NANO_TIMESTAMP
CONNECTION_ID                                                                     STRING
GATEWAY_ID                               TestAlerts                               STRING
GATEWAY_TYPE                             MsTeamsChannel                           ENUM[Log EmailUser EmailDistribution SymphonyByUserEmail SymphonyRoom MsTeamsChannel SymphonyRoomReqRep]
GATEWAY_VALUE                            https://netorg209792.webhook.office.c... STRING
INCOMING_TOPIC                                                                    STRING
-------------------------------------------------------------------------------------------
```

### NOTIFY_ROUTE

You need at least one NOTIFY_ROUTE entry set up to point to the GATEWAY record, so that NOTIFY records are routed as messages.

| Field Name | Usage |
| --- | --- |
| ENTITY_ID | N/A |
| ENTITY_ID_TYPE | Always `GATEWAY` |
| GATEWAY_ID | Should match GATEWAY_ID in the corresponding GATEWAY record |
| NOTIFY_ROUTE_ID | This will be auto generated if left blank, else be sure to give it a unique value with respect to other records |
| TOPIC_MATCH | This can be anything, NOTIFY records will target this via the TOPIC field, and messages will be routed to all gateways with a matching TOPIC_MATCH value. In a simple/typical setup we make it match the GATEWAY_ID in the corresponding GATEWAY record |

Here is an example NOTIFY_ROUTE entry:

```
==================================
NOTIFY_ROUTE
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-03-16 08:47:59.968(n:0,s:3572)      NANO_TIMESTAMP
ENTITY_ID                                                                         STRING
ENTITY_ID_TYPE                           GATEWAY                                  ENUM[USER_NAME PROFILE_NAME GATEWAY]
GATEWAY_ID                               TestAlerts                               STRING
NOTIFY_ROUTE_ID                          000000000000001NRLO1                     STRING
TOPIC_MATCH                              TestAlerts                               STRING
-------------------------------------------------------------------------------------------
```

### NOTIFY

Writing a record to this table which correctly points to a TOPIC, will result in a message being sent to the Teams channel the GATEWAY record is pointed to.

Equally, EVENT_NOTIFY_INSERT can be used, as opposed to a direct table write (and is the encouraged form of interaction), this event allows for the same set of fields as the DbRecord. The input fields detailed below cater for either approach.

| Field Name | Usage                                                                                  |
| --- |----------------------------------------------------------------------------------------|
| APPLICATION_REF | N/A                                                                                    |
| BODY | The body of the message                                                                |
| DOCUMENT_ID | N/A                                                                                    |
| EXPIRY | N/A                                                                                    |
| HEADER | The first line of the message                                                          |
| NOTIFY_COMPRESSION_TYPE | N/A                                                                                    |
| NOTIFY_ID | Autogenerated Unique value                                                             |
| NOTIFY_SEVERITY | Severity of the alert. Value will be placed to right of header text in square brackets |
| SENDER | N/A                                                                                    |
| TOPIC | The TOPIC_MATCH value on the NOTIFY_ROUTE record you wish to target                    |

Here is an example of using NOTIFY:

```
==================================
NOTIFY
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-03-16 12:29:50.659(n:0,s:4063)      NANO_TIMESTAMP
APPLICATION_REF                                                                   STRING
BODY                                     This is my body                          STRING
DOCUMENT_ID                                                                       STRING
EXPIRY                                                                            DATETIME
HEADER                                   My Header                                STRING
NOTIFY_COMPRESSION_TYPE                                                           STRING
NOTIFY_ID                                000000000000001NTLO1                     STRING
NOTIFY_SEVERITY                          Information                              ENUM[Information Warning Serious Critical]
SENDER                                                                            STRING
TOPIC                                    TestAlerts                               STRING
-------------------------------------------------------------------------------------------
```

This example results in a Teams channel message, such as:

![](/img/notify-teams-example.png)
