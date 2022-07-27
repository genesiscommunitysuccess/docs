---
id: intro
title: Introduction
sidebar_label: Introduction
sidebar_position: 1

---

# Building a data pipeline application

This tutorial will guide you through creating a Genesis application that will ingest data from a PostgreSQL server to the Genesis platform. 

Before you follow this tutorial, you need to have the Genesis low-code platform and [your development environment fully installed](/creating-applications/getting-ready-to-develop/workstation-setup/), and you need to be familiar with the key information from the Getting Started section. You will also need to have a PostgreSQL server set up that will be used as a source for the data. The server has to meet the [following](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/#postgresql-configuration) configuration to be able to capture changes. If you start PostgreSQL from a Docker image check the notes [here](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-runtime/#starting-source-postgresql-as-a-docker-image)

In short, you need to understand:

* The [overall architecture of a Genesis application](/getting-started/what-is-the-genesis-low-code-platform/)
* How to [create a new project](/creating-applications/creating-a-new-project/alternative_options_supported/server-project-setup/)

Before you start, make sure you have the platform and all the relevant tools [installed](/creating-applications/getting-ready-to-develop/running-applications/options/install-in-three-steps/). The Genesis low-code platform can be installed on a server, local vm, wsl, or cloud instance (genesis and auth).

Alternatively you can set-up the Genesis environment using the [set-up tasks](/creating-applications/creating-a-new-project/recommended-full-stack-project-setup/configure-deployment-plugin/) from your IDE.

## The scenario
We want to build an application that will stream newly created rows in the PostgreSQL server to the Genesis platform. These are the application requirements:
- Each row will represent a trade
- Each trade has associated instrument
- The instrument data is pre-existing in the Genesis platform so the actual instrument can be looked up
- If the instrument doesn't exist it gets created on the fly and the newly created instrument gets associated with the trade

Here is a high-level view of what we are going to build:

![](/img/data-pipeline-tutorial.jpg)

Working through the tutorial will show you:
* how to integrate external data source using data pipeline configuration