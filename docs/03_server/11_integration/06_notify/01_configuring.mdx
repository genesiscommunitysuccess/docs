---
title: 'Notify - introduction'
sidebar_label: 'Introduction'
id: configuring
keywords: [server, integration, notify, configuration]
tags:
  - server
  - integration
  - notify
  - configuration
---

The Genesis Notify module enables you to configure an application to send and receive messages to and from various messaging services.
You can send messages to:

* The screen of any Genesis application
* Email (via SMTP)
* Symphony
* Microsoft Teams

The Notify module provides a single Microservice: GENESIS_NOTIFY. The Notify service listens to updates on the NOTIFY table in the database and takes care of sending the notifications where they need to go. It is possible to send to multiple destinations, such as Email and Symphony.

Here, we shall give you a high-level view of the configuration items and why they are needed. 
There are separate configuration details for each service that you connect to (Email, Teams and Symphony), along with useful examples.

## Notify concepts

### Gateways
A gateway is a connection to any delivery system for notifications. Gateways are configured once on application startup, and the configuration is specified in a GPAL script file.
A single SMTP server, teams server or a single symphony instance would be examples of gateways. To connect to more than one server, configure multiple gateways.

### Notifications
A notification is a message that you want to send somewhere. The notification has a header, a body detailing the message and a topic. The topic determines how GENESIS_NOTIFY will route the notification.

Notifications are represented by the NOTIFY table in the database. They are generic, and are capable of being sent to multiple destinations.

To create a notification in a Genesis System, all you need to do is create a NOTIFY record in the database. GENESIS_NOTIFY will take care of the rest, based on the routes that are configured.

### Routes
A route determines how the notification will get sent. Different gateways support different route types, but there are fields that are common to all types: 

- identifier
- topic match: where the topic on a notification is a match for the topic on the route, the notificiation will be sent on that route

Each route type is a view across the NOTIFY_ROUTE base table, and a specific extension table that defines the fields for that view type. 
All the metadata-management APIs deal directly with the views, so you can think of each route type as an extension to the core NOTIFY_ROUTE table, similar to polymorphic classes in Java.

### Entity types
Some route types are used for sending notifications directly to users of the application. For example, a SCREEN_ROUTE can send toast notifications directly to a user's screen, and an EMAIL_USER_ROUTE can send a notification directly to a user's email address. In contrast, an EMAIL_DISTRIBUTION_ROUTE can send a notification to email addresses that are not tied to a specific user in the system.

For routes that are used to send to application users, two fields are present on the route object: ENTITY_ID and ENTITY_ID_TYPE. These fields represent a user or set of users to deliver the notification to.

ENTITY_ID_TYPE is an enumeration with the following possible values.

| ENTITY_ID_TYPE | Description |
| --- | --- |
| ALL | Sends to all active users within the system. If the type is ALL, ENTITY_ID will be null. |
| SELF | Sends the notification to the user populated in the 'Sender' field of the notification. Example: Password reset notifications. If the type is SELF, ENTITY_ID will be null. |
| USER_NAME | If the type is USER_NAME, ENTITY_ID will be a single USER_NAME that will receive the notification.   |
| PROFILE_NAME | If the type is PROFILE_NAME, ENTITY_ID will be the name of a PROFILE. All users that have that profile assignment will receive the notification.  |

An additional value is available that matches the ENTITY_ADMIN_PERMISSION_FIELD, if it is defined in Sysdef. This is used primarily in multi-tenant systems. If using this value, notifications can be sent to everyone with visibility on a particular entity.
