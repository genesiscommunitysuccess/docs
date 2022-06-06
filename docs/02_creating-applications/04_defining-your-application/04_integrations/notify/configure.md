---
title: Configuring Notify
sidebar_label: Configuring Notify
sidebar_position: 1
id: configure

---
## Overview

The Genesis Notify module enables you to configure an application to send and receive messages to and from various messaging services.
You can send messages to:

* Email (via SMTP)
* Symphony
* Microsoft Teams

You can receive messages from:

* Symphony

## Configuration overview

Genesis Notify is a generic service; it has various configuration requirements across system definition and the database. Here, we shall give you a high-level view of those configuration items and why they are needed. 

There are separate configuration details for each service that you connect to (email, Teams and Symphony), along with useful examples.

### System definition

This is used to store high-level connection details to the given, for example SMTP server configuration, Symphony/Teams server configurations.

### Database
Here we describe the records and table to be used.

### GATEWAY

A gateway record gives details to a given “entity” within the given service.

* For email, this is a set of addresses to send emails to
* For Symphony or Teams, it contains details of a given “chat” or “room”. Each record is given a topic

### NOTIFY

A Notify record represents a given message that we want to “notify” to a given service (e.g. the details of an email to send, or a chat message to send to symphony/teams).

### NOTIFY_ROUTE

The Notify route table provides a link from NOTIFY that can be picked up and sent to the given GATEWAY. It is intended for future developments of the Notify service such as:

* Topic based multi-service messages
* Retry mechanisms
 

Our tutorial has practical examples of configuring Notify for [static](tutorials/building-an-application/events/static-events/) and [dynamic](/tutorials/building-an-application/events/dynamic-events/) events.