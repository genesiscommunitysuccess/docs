---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---

[Introduction](/server/data-server/introduction) | [Basics](/server/data-server/basics) |  [Advanced](/server/data-server/advanced) | [More examples](/server/data-server/examples) | [Configuring runtime](/server/data-server/configuring-runtime) | [Testing](/server/data-server/testing)

```mermaid
graph TD
A[UI] --> |Connection| B(DATA_SERVER)
B -->|Inital Data| A
B --> |Updates| A
B -->|Connection| C[Database]
C --> |Changes in table/view trigger a read|B
```
Data Servers monitor specific tables or views in the database. When a change in data occurs, the Data Server sends the updates to all of its subscribers.

The Data Server configuration is refreshingly light, because all the hard work is done by the table or views.

A Data Server file consists of a number of queries that handle each event in the required way. You can define any number of queries. A query can be on an individual table or view. All the details of the table or view are inherited from the definition, so you don’t need to supply any further details.

The initial run of the query serves all the data that is defined by the table or view. From then on, it automatically monitors the user who has requested the data. Whenever a value in the underlying table or view changes, that change is sent to the user. In this way, the user’s data is maintained up to date in real time, without the unnecessary burden of sending the whole data set each time there is a change.

Data Servers are conventionally defined in the file _application-name_**-dataserver.kts**.

So, if your application is called **positions**, then the file would conventionally be named **positions-dataserver.kts**.

Note, you will also need to declare your Data Server within the [runtime configuration](/server/data-server/configuring-runtime/).
