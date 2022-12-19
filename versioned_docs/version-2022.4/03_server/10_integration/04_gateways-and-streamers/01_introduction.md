---
title: 'Gateways and Streamers - Introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, integration, gateways, streamers, introduction]
tags:
  - server
  - integration
  - gateways
  - streamers
  - introduction
---
If your application needs to integrate with external systems, you need to be able to interpret incoming messages in the format of the external system and you need to be able to reformat information from the Genesis database when you send messages out to that system.

For this, Genesis uses Streamers, Streamer Clients and gateways.

* A **Streamer** listens to a table or view, and streams data out to Streamer Clients. In almost all cases, you listen to a reliable, auditable table with unique time-stamped updates - an audit table. This ensures that, in the event of failure, the Streamer is able to go back and stream from a specific timestamp.
  Follow this link to learn more about [Streamers](/03_server/10_integration/04_gateways-and-streamers/02_streamer.md).
* A **Streamer Client** is at the other end of the stream. At login, it specifies which streams of data it wants to receive. When it receives data from the Streamer, it transforms the data from our model into a FIX message and passes the results to the relevant destinations.
  Follow this link to know more about [streamer-clients](/03_server/10_integration/04_gateways-and-streamers/03_streamer-client.md)
* A **gateway** is a message routing service that connects to an external service. For example, a FIX gateway uses the FIX protocol to connect to exchanges or other trading hubs.

Having a separate Streamer and Streamer Client enables you to use a single Streamer to serve multiple clients that perform different activities.

For example, you could have two separate Streamer Clients listening to Streamer A:

* Streamer Client 1 passes data to the FIX gateway
* Streamer Client 2 passes the data to a separate external application

### Outbound and inbound FIX

For **outbound** FIX messages, you have to create Streamers that listen to specific tables and views in the application's database.

The outbound Streamer streams data updates to the outbound Streamer Client.

The outbound Streamer Client transforms the data into a FIX message, and passes it to the FIX gateway. From there, the message is sent to the external system you are integrating with.

![](/img/fixout.png)

**Inbound** FIX messages arrive through the FIX gateway and are written to a table in the data server called FIX_IN.

You need to create a Streamer to monitor this table and stream the data to the relevant inbound Streamer client (or clients). The Streamer client transforms the data to conform to the Genesis data set and passes it to the application’s Event Handler.

![](/img/fixin.png)

### The FIX module

Note that Genesis has a pre-built FIX module, which has all the Quick FIX libraries. It also gives you a default outbound Streamer that is set up to listen to the FIX_IN table in the database.

### FIX Xlator
The FIX Xlator is a plugin for the Streamer and Streamer client, to bring in type-safe handling of FIX messages.
Follow this link to know more about [FIX Xlator](/03_server/10_integration/04_gateways-and-streamers/04_fix-xlator.md).

