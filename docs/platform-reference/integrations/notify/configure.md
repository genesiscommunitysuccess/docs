---
title: Configuring Notify
sidebar_label: Configuring Notify
sidebar_position: 1
id: configure

---
## Overview

The Genesis Notify module enablse you to configure an application to send and receive messages to and from various messaging services.
The growing list of currently supported services is:

### Sending:

* Email (via SMTP)
* Symphony
* Microsoft Teams

### Receiving:

* Symphony

## Configuration overview

Genesis Notify is a generic service; it has various configuration requirements across system definition and the database. Here, we shall give you a high-level view of those configuration items and why they are needed. Supplementing this, we have listed each service, along with the specific configuration requirements and examples.

### System definition

This is used to store high-level connection details to the given, for example SMTP server configuration, Symphony/Teams server configurations.

### Database
Here we describe the records and table to be used.

#### GATEWAY

A gateway record gives details to a given “entity” within the given service.

* For email, this is a set of addresses to send emails to
* For symphony/teams, it contains details of a given “chat” or “room”. Each record is given a topic

##### NOTIFY

A notify record represents a given message that we want to “notify” to a given service (e.g. the details of an email to send, or a chat message to send to symphony/teams.

#### NOTIFY_ROUTE

The notify route table provides linkage between NOTIFY, so that it can be picked up and sent to the given GATEWAY. It is intended for future developments of the notify service such as:

* Topic based multi-service messages
* Retry mechanisms