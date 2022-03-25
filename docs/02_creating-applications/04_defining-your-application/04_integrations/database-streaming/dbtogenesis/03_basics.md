---
sidebar_position: 3
title: Basics
sidebar_label: Basics
id: dbtogenesis-basics

---


[Introduction](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/overview/)  | [Where to define](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-where-to-define/) | [Basics](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-basics/) | [Advanced](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-advanced/) | [More examples](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-examples/) | [Configuring runtime](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-runtime/) | [Testing](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-testing/)


This page covers the arguments attached to the DbToGenesis script.

## Arguments

Use **startProcess** to start the **DbToGenesis** process. This can take two optional arguments.

- **--clearText** can be passed if you want to use clear text user and passwords in the configuration file, instead of encrypted ones.

- **--force** if passed to the process, this  attempts to re-insert every trade found in our Genesis table to the RDBMS, ignoring previously inserted records.

