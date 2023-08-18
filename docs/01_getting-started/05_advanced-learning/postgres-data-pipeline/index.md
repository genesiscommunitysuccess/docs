---
id: intro
title: Introduction
sidebar_label: Introduction
sidebar_position: 1
---

# Building a data pipeline application

This tutorial will guide you through creating a Genesis application that will ingest data from a PostgreSQL server to the Genesis platform.

Before you follow this tutorial, you need to have the Genesis low-code platform and your development environment fully installed, and you need to be familiar with the key information from the [quick start guide](../../../getting-started/quick-start/). You will also need to have a PostgreSQL server set up that will be used as a source for the data. The Postgres server has to meet the [required configuration](../../../server/integration/data-pipeline/advanced/#postgresql-configuration-1) to be able to capture changes. If you start PostgreSQL from a Docker image check the notes [here](../../../server/integration/data-pipeline/configuring-runtime/#starting-source-postgresql-as-a-docker-image).

In short, you need to understand:

* The [overall architecture of a Genesis application](../../../getting-started/learn-the-basics/simple-introduction/)
* How to create a new project

## The scenario
We want to build an application that will stream newly created rows from our remote PostgreSQL server to the Genesis platform. These are the application requirements:
- Each row will represent a trade
- Each trade has an associated instrument
- The instrument data is pre-existing in the Genesis platform so the actual instrument can be looked up
- If the instrument doesn't exist it gets created on the fly and the newly created instrument gets associated with the trade

Here is a high-level view of what we are going to build:

![](/img/postgres-data-pipeline-tutorial.jpg)

Working through the tutorial will show you:
* how to integrate with an external data source using the Genesis Data Pipeline configuration