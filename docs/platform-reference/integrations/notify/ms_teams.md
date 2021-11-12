---
title: 'Microsoft Teams'
sidebar_label: 'Microsoft Teams'
sidebar_position: 4
id: ms_teams
---
Microsoft Teams provides a mechanism for exposing its channels to a remote system via webhooks. A webhook url can be created as described [here](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)

#### GATEWAY

| Field Name | Usage |
| --- | --- |
| GATEWAY_ID | A Unique name for the gateway which can be referenced in the NOTIFY_ROUTE table  |
| GATEWAY_TYPE | should be set to MsTeamsChannel |
| GATEWAY_VALUE | Teams WebHook Url |
| INCOMING_TOPIC | Do not currently support incoming messages |
| CONNECTION_ID | N/A
