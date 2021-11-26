---
id: application
sidebar_label: 'This is what an application looks like '
sidebar_position: 30
title: 'This is what an application looks like'
---

All Genesis applications share a common architecture. If you familiarise yourself with the components in the server and the web front-end, you will immediately have an understanding of the purpose of all the main elements of that architecture.

Get to know the components of the server and front end right away; this diagram is the foundation that every developer needs to know.

![](/img/this-is-what-a-genesis-application.png)

The User Interface is at the top. The server sits below. 

Both of these include system microservices that are part of the LCNC platform (these are the red boxes n the diagram). They control key aspects of the platform that run automatically, such as data persistence and inter-process messaging. You do not need to provide these essential functions. They have been done for you, and you can concentrate on configuring the services that make your application unique.

## The server

At the heart of the server is the data persistence layer and the data model. You model your data by defining fields, then tables, then views, which can be of a single table or of more than one table, with joins. 

In most cases, you will also define state machines, because key financial entities, such as orders or trades, usually progress from state to state (new, pending, filled, complete, etc.).

You bring your application to life by creating a skeleton project and then configuring these main components:

**Event handlers**. The system is driven by events. These can be incoming messages, changes in the database or user clicks on the UI. You configure the system so that it knows how to behave in response to each event.

**Consolidators** monitor key data in real time, perform calculations (analytics) and feed that information back to a separate area to provide the information in real time.

**Interface handlers** handle integration with external systems, such as FIX Gateways for order routing or external relational databases.

**Data Servers** make real-time information available to the UI. The first request provides all the information being monitored. After that, only changed fields are passed back to the UI in real time.

**Request/Reply** (Request Servers) provide snapshot (non-real-time) information to the UI.

## The User Interface

You can define all the elements you want to see in the Web User Interface using the Genesis Studio. It is easy to select these, configure them, then connect them to the relevant resource in the server (data server or request server) to provide the relevant permissioned data.