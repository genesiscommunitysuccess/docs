---
id: component-architecture-overview
sidebar_label: 'Architecture overview'
sidebar_position: 1
title: 'Component architecture overview'
---

Every Genesis application is different, but all Genesis applications share a common architecture. The best way to understand the purpose of all the main elements of this architecture is to familiarise yourself with the server components and the web front-end.

The diagram below shows what an example application looks like and well explains the server components and web front-end. Hence, this diagram can be the foundation for every developer.

![](/img/component-architecture-02.png)

The User Interface is at the top. The server sits below it.

Both of these include system microservices that are part of the Genesis low-code platform (the red boxes in the diagram). They control key aspects of the platform that run automatically, such as data persistence and inter-process messaging. You do not need to provide these essential functions yourself as they have already been done for you. You can simply concentrate on configuring the services that make your application unique.

## The server

At the center of the server is the data persistence layer and the data model. You model your data by defining fields, then tables and then views, which can be of a single table or of more than one table, with joins.

In most cases, you will also define state machines, because key financial entities, such as the orders or the trades, usually progress from state to state (new, pending, filled, complete etc.).

Your application comes to life when you create a base skeleton project and then configure these main components:

**Event handlers**. The system is driven by events. These can be incoming messages, changes in the database or the user clicks on the UI. You configure the system so that it knows how to behave in response to each event.

**Consolidators** monitor key data in real-time, perform calculations (analytics) and feed the resulting information back to a separate area to provide the information in real-time.

**Integration components** handle integrations with the external systems, such as FIX Gateways for the order routing or the external relational databases.

**Data servers** make real-time information available to the UI. The first request provides all the information which is being monitored. After that, only the changed fields are passed back to the UI in real-time.

**Request servers** provide snapshot (non real-time) information to the UI.

## The User interface

Using our tools, you can define pages, install grids, charts and other visual components, then connect these to the resources in the server. Thereafter, the permitted users can log in to it. You can assign the user groups with the rights to view specific data and have access to specific functions.
 
