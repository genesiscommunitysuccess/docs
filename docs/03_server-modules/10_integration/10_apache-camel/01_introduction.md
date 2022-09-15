---
title: 'Apache Camel - Introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [apache camel]
tags:
    - apache camel
---

[Introduction](/server-modules/integration/apache-camel/introduction/)  | [Basics](/server-modules/integration/apache-camel/basics) | [Advanced](/server-modules/integration/apache-camel/advanced) | [Examples](/server-modules/integration/apache-camel/examples) | [Configuring runtime](/server-modules/integration/apache-camel/configuring-runtime) | [Testing](/server-modules/integration/apache-camel/testing)

The Genesis low-code platform supports the use of [Apache Camel](https://camel.apache.org/) in order to integrate with external systems, using its plethora of [components](https://camel.apache.org/components/3.16.x/index.html).

Genesis makes this easy to configure and set up, allowing new processors to be defined and used within GPAL.

Likely uses for Apache Camel include:

* receiving data [from the local filesystem](/getting-started/use-cases/loading-feed-data/overview/)
* transmitting data [to or from an external location](/getting-started/use-cases/loading-feed-data/sftp-and-encryption/).

Note that Camel's power and flexibility come at the cost of some complexity and configuration overhead.

If you simply want to ingest and transform data from the most common sources (e.g. CSV files and relational databases), you should first investigate the new [Genesis Data Pipeline](/server-modules/integration/data-pipeline/introduction/), which offers a higher-level ingestion workflow than the Apache Camel DSL.
