---
sidebar_position: 2
title: Where to define
sidebar_label: Where to define
id: datapipeline-where-to-define

---

[Introduction](/creating-applications/defining-your-application/integrations/data-pipeline/overview/)  | [Where to define](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-where-to-define/) | [Basics](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-basics/) | [Advanced](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/) | [More examples](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/) | [Configuring runtime](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-runtime/) | [Testing](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-testing/)

You can configure data pipeline in a file called _pipeline-name_**-data-pipeline.kts**. This must be located in your application's script directory.

The configuration contains a collection of `sources` and each one has two main sections:
- configuration: how to connect to the data source
- mapper: maps the incoming data
