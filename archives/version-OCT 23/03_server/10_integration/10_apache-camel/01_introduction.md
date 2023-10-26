---
title: 'Apache Camel - introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, integration, apache camel, introduction]
tags:
  - server
  - integration
  - apache camel
  - introduction
---

The Genesis low-code platform supports the use of [Apache Camel](https://camel.apache.org/) in order to integrate with external systems, using its plethora of [components](https://camel.apache.org/components/next/index.html).

Genesis makes this easy to configure and set up, allowing new processors to be defined and used within GPAL.

You can use Apache Camel for:

* receiving data [from the local filesystem](../../../../getting-started/advanced-learning/loading-feed-data/overview/)
* transmitting data [to or from an external location](../../../../getting-started/advanced-learning/loading-feed-data/sftp-and-encryption/).
* consuming data from email - [camel-mail](https://camel.apache.org/components/3.21.x/mail-component.html)
* RESTful API integration - [camel-http](https://camel.apache.org/components/3.21.x/http-component.html)
* database integration - [camel-sql](https://camel.apache.org/components/3.21.x/sql-component.html).

These are just few examples of what you can do with apache camel. To learn more, check out the [Apache Camel documentation](https://camel.apache.org/docs/).

:::caution
Note that Camel's power and flexibility come at the cost of some complexity and configuration overhead.
:::

If you simply want to ingest and transform data from the most common sources (e.g. csv files and relational databases), you should first investigate the [Genesis Data Pipeline](../../../../server/integration/data-pipeline/introduction/), which offers a higher-level ingestion workflow than the Apache Camel DSL.
