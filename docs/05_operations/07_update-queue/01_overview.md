---
title: 'Update queue - overview'
sidebar_label: 'Overview'
id: overview
keywords: [operations, update queue]
tags:
    - operations
    - update queue
---

### What is the update queue?
The update queue is part of the Genesis database layer and is the underlying technology that powers our real-time updates.

### Why do we have an update queue?
Genesis provides an update queue so that processes can be kept up-to-date with the latest changes in the database, without needing to poll the database:
![](/img/update-queue-overview.png)
In the above example, the data_server exposes the all_trades resource. This should provide all trades within the application. When the data_server starts, it will contact the db_server and read all the trades from the database. At the same time, the data_server also starts listening to the update queue.

When the event_handler receives a trade insert event, it writes this to the db_server database, using its local database connection (event_db). After the update has been written, the process publishes the update on the update queue to be consumed by any subscribers.

As the data_server is automatically subscribed to those updates from the update queue, it gets the updates without having to re-query the database.

### Update queue options
There are two different update queue technologies to choose from, depending on your requirements:

- [ZeroMQ](02_zeromq.md) (Default) - a decentralised peer-to-peer set-up, which relies on a fixed cluster size
- [MQTT](03_mqtt.md) - use an independent MQTT broker if you want to allow dynamic scaling
