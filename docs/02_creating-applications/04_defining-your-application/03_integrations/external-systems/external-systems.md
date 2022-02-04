---
title: Integrate with external systems
sidebar_label: Integrate with external systems
sidebar_position: 1
id: configure

---
If your application needs to integrate with external systems, you need to be able to interpret incoming messages in the format of the external system and you need to be able to reformat information from the Genesis database when you send messages out to that system.

For this, Genesis uses streamers, streamer clients and gateways.

* A **streamer** listens to a table or view, and streams data out to streamer clients. In almost all cases, you listen to a reliable, auditable table with unique time-stamped updates - an audit table. This ensures that, in the event of failure, the streamer is able to go back and stream from a specific timestamp.
  Follow this link to know more about [streamer](/platform-reference/integrations/external-systems/streamer)
* A **streamer client** is at the other end of the stream. At login, it specifies which streams of data it wants to receive. When it receives data from the streamer, it transforms the data from our model into a FIX message and passes the results to the relevant destinations.
  Follow this link to know more about [streamer-client](/platform-reference/integrations/external-systems/streamer-client)
* A **gateway** is a message routing service that connects to an external service. For example, a Fix gateway uses the FIX protocol to connect to exchanges or other trading hubs.

Having a separate streamer and streamer client enables you to use a single streamer to serve multiple clients that perform different activities.

For example, you could have two separate streamer clients listening to streamer A:

* streamer client 1 passes data to the FIX gateway
* streamer client 2 passes the data to a separate external application

### Outbound and inbound FIX

For **outbound** FIX messages, you have to create streamers that listen to specific tables and views in the application's database.

The outbound streamer streams data updates to the outbound streamer client.

The outbound streamer client transforms the data into a FIX message, and passes it to the FIX gateway. From there, the message is sent to the external system you are integrating with.

![](/img/fixout.png)

**Inbound** FIX messages arrive through the FIX gateway and are written to a table in the data server called FIX_IN.

You need to create a streamer to monitor this table and stream the data to the relevant inbound streamer client (or clients). The streamer client transforms the data to conform to the Genesis data set and passes it to the application’s event handler.

![](/img/fixin.png)

### The FIX module

Note that Genesis has a pre-built FIX module, which has all the Quick FIX libraries. It also gives you a default outbound streamer that is set up to listen to the FIX_IN table in the database.

### FIX Xlator
The FIX Xlator is a plugin for the streamer and streamer client, to bring in type-safe handling of FIX messages.
Follow this link to know more about [FIX Xlator](/platform-reference/integrations/external-systems/fix-xlator)
