---
id: intro
sidebar_label: 'Introduction'
sidebar_position: 1
title: 'Introduction'
---

This area enables you to look in detail at how you create the server for an application on the platform.

Depending on how you approach the task, you need to create a project so that you can build the tables and views that are at the heart of any application.

In some cases, you will be creating these from nothing; in other cases, you will be creating a schema by converting an existing database or Excel spreadsheet.

Broadly, there are eight main steps in creating a server. Depending on the complexity of your application, some of these will take more time than others.

1. [**Define your data model**](data-model). Once you have analysed your journeys, you can define your data in terms of fields, tables and views.
2. [**Configure your event handlers**](event-handlers). This is where you specify how the system reacts to changes in the database, incoming messages, or clicks in the User Interface.
3. [**Define your state machines**](state-machine). Here you define state machines and the possible transitions between each state.
4. [**Configure your request servers**](request-servers). These provide static data to the User Interface (for dialogs or charts, for example).
5. [**Configure your data servers**](data-servers). These automatically provide real-time information to permissioned users via the User Interface.
6. [**Integrate with external systems**](external-systems). In most cases, the application will receive messages from external systems and/or send messages out. This is where you configure how the messages are formatted so that incoming messages are reformatted to Genesis data model and outgoing messages are suitable formatted (such as FIX messages).
7. [**Set up authentication and authorisation**](auth). This is where you control access to the application and permission to view specific data or perform specific functions.
8. [**Configure your consolidators**](consolidators). These perform aggregation of data (for example, incoming trades) and calculations (such as risk positions),

Once you have completed these steps, you will have a working server, ready to provide information to your User Interface.