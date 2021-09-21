---
title: 'Configuring Notify'
sidebar_label: 'Configuring notify'
sidebar_position: 1
id: configure
---

### Overview
The Genesis Notify is designed to allow simple configuration for sending and receiving of messages to/from various messaging services. 
The growing list of currently supported services are:

#### Sending:
* Email (via SMTP)
* Symphony
* Microsoft Teams

#### Receiving:
* Symphony


### Configuration Overview

Gensis Notify is a generic service, and there are various configuration items across system defintion and the database required. The following gives a high level overview of the configuration items and why they are needed. Supplementing this we have each service listed with the specific configuration items and examples for the given service.

#### System Definition

Used to store high level connection details to the given, for example SMTP server configuration, Symphony/Teams server configurations.

#### Database

##### GATEWAY

A gateway record gives details to a given “entity” within the given service. 
For email this is a set of addresses to send emails to
For symphony/teams it contains details of a given “chat” or “room”. Each record is given a topic

##### NOTIFY

A notify record represents a given message that we want to “notify” to a given service (e.g. the details of an email to send, or a chat message to send to symphony/teams.

##### NOTIFY_ROUTE

The notify route table provides linkage between NOTIFY, so that it can be picked up and sent to the given GATEWAY. It is intended for future developments of the notify service such as:

* Topic based multi service messages
* Retry mechanisms
